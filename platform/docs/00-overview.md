# 3ers Platform — Master Plan

## What we're building

A production SaaS platform sitting around the existing wedding invitation template. Three surfaces, one shared backend, fully Dockerised.

| Surface          | Audience          | Purpose                                       |
| ---------------- | ----------------- | --------------------------------------------- |
| `apps/marketing` | Couples + public  | Landing page — converts visitors to clients   |
| `apps/admin`     | Internal (Nidhal) | Manage orders, clients, templates, RSVP data  |
| `apps/portal`    | Clients (couples) | Configure invitation, track order, view RSVPs |

Existing invitation lives in `apps/invite` (current repo root, migrated into monorepo).

---

## Infrastructure

| Layer        | Choice              | Why                                           |
| ------------ | ------------------- | --------------------------------------------- |
| Database     | PostgreSQL (Docker) | Relational, typed, migrations via SQL         |
| File storage | MinIO (Docker)      | S3-compatible, self-hosted, no vendor lock    |
| Auth         | NextAuth.js (JWT)   | Shared across admin + portal, different roles |
| Email        | Resend              | Magic links, order status, notifications      |
| Payments     | Stripe Checkout     | Invoice + payment link per order              |
| Container    | Docker + Compose    | All services in one `docker-compose.yml`      |

---

## Monorepo structure

```
3ers/
├── apps/
│   ├── invite/          ← existing template (migrated from root)
│   ├── marketing/       ← landing page (Next.js)
│   ├── admin/           ← internal panel (Next.js)
│   └── portal/          ← client CMS (Next.js)
├── packages/
│   ├── ui/              ← shared design tokens + shadcn components
│   ├── db/              ← Postgres client (pg / Drizzle ORM) + types
│   └── config/          ← shared tsconfig, tailwind preset, eslint
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── postgres/
│   │   └── init.sql     ← schema bootstrap
│   └── minio/
│       └── init.sh      ← bucket creation
├── platform/
│   └── docs/            ← this folder
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Build order

1. **Infra** — Docker Compose: Postgres + MinIO + pgAdmin + MinIO console
2. **packages/db** — Drizzle ORM schema, migrations, typed client
3. **packages/ui** — shared tokens from DESIGN.md, base components
4. **apps/admin** — orders + config editor (first to unblock real clients)
5. **apps/portal** — client content form + preview + RSVP viewer
6. **apps/marketing** — landing page (needs real previews to show)
7. **apps/invite** — migrate current root into monorepo app

---

## Docs index

- [01-data-model.md](./01-data-model.md) — full database schema
- [02-infra.md](./02-infra.md) — Docker Compose, MinIO, Postgres setup
- [03-marketing.md](./03-marketing.md) — landing page modules + copy plan
- [04-admin.md](./04-admin.md) — admin panel modules + routes
- [05-portal.md](./05-portal.md) — client portal modules + routes
- [06-auth.md](./06-auth.md) — auth strategy, roles, session model
- [07-storage.md](./07-storage.md) — MinIO bucket layout + upload flow
- [08-monorepo.md](./08-monorepo.md) — pnpm workspaces + Turborepo setup
- [09-domains.md](./09-domains.md) — celebrio-digital.com DNS, Vercel projects, multi-zone proxy, deploy order
