# Infrastructure — Docker Compose

## Services

| Service | Image | Port | Purpose |
|---|---|---|---|
| `postgres` | postgres:16-alpine | 5432 | Primary database |
| `pgadmin` | dpage/pgadmin4 | 5050 | DB GUI (dev only) |
| `minio` | minio/minio | 9000 / 9001 | Object storage (API / Console) |
| `invite` | custom | 3900 | Wedding invitation app |
| `admin` | custom | 3901 | Admin panel |
| `portal` | custom | 3902 | Client portal |
| `marketing` | custom | 3903 | Landing page |

---

## File layout

```
infra/
├── docker-compose.yml          ← production compose
├── docker-compose.dev.yml      ← dev overrides (hot reload, pgadmin)
├── postgres/
│   └── init.sql                ← schema bootstrap (idempotent)
└── minio/
    └── init.sh                 ← mc alias + bucket creation
```

Each `apps/*` has its own `Dockerfile`.

---

## docker-compose.yml (skeleton)

```yaml
version: '3.9'

services:

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-threers}
      POSTGRES_USER: ${POSTGRES_USER:-threers}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
      - ./infra/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-threers}"]
      interval: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 5s
      retries: 5

  minio-init:
    image: minio/mc:latest
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: ["/bin/sh", "/init.sh"]
    volumes:
      - ./infra/minio/init.sh:/init.sh:ro
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}

  invite:
    build:
      context: .
      dockerfile: apps/invite/Dockerfile
    restart: unless-stopped
    ports:
      - "3900:3000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file: .env

  marketing:
    build:
      context: .
      dockerfile: apps/marketing/Dockerfile
    restart: unless-stopped
    ports:
      - "3903:3000"
    env_file: .env

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    restart: unless-stopped
    ports:
      - "3901:3000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file: .env

  portal:
    build:
      context: .
      dockerfile: apps/portal/Dockerfile
    restart: unless-stopped
    ports:
      - "3902:3000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file: .env

volumes:
  pg_data:
  minio_data:
```

---

## docker-compose.dev.yml (overrides)

```yaml
# Usage: docker compose -f docker-compose.yml -f docker-compose.dev.yml up
services:

  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@3ers.tn
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-dev}
    depends_on:
      - postgres

  invite:
    volumes:
      - ./apps/invite:/app/apps/invite
    command: pnpm dev

  marketing:
    volumes:
      - ./apps/marketing:/app/apps/marketing
    command: pnpm dev

  admin:
    volumes:
      - ./apps/admin:/app/apps/admin
    command: pnpm dev

  portal:
    volumes:
      - ./apps/portal:/app/apps/portal
    command: pnpm dev
```

---

## MinIO init script (`infra/minio/init.sh`)

```sh
#!/bin/sh
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing local/3ers-assets
mc anonymous set download local/3ers-assets/public
```

Buckets:
- `3ers-assets/orders/{orderId}/` — couple + venue photos
- `3ers-assets/public/` — template preview images (publicly readable)

---

## Environment variables (`.env.example`)

```env
# Postgres
POSTGRES_DB=threers
POSTGRES_USER=threers
POSTGRES_PASSWORD=changeme

# MinIO
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=changeme
MINIO_ENDPOINT=http://minio:9000
MINIO_PUBLIC_URL=http://localhost:9000

# Auth
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3901   # admin
PORTAL_NEXTAUTH_URL=http://localhost:3902

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM=no-reply@3ers.tn

# App URLs
INVITE_BASE_URL=http://localhost:3900
ADMIN_URL=http://localhost:3901
PORTAL_URL=http://localhost:3902
MARKETING_URL=http://localhost:3903
```

---

## Dockerfile pattern (each app)

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ packages/
COPY apps/<name>/package.json apps/<name>/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter <name> build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/<name>/.next/standalone ./
COPY --from=builder /app/apps/<name>/.next/static ./.next/static
COPY --from=builder /app/apps/<name>/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Uses Next.js `output: 'standalone'` for minimal image size.
