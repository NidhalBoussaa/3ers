# Domains & Deployment — celebrio-digital.com (self-hosted, shared server)

How the four 3ers apps run alongside the server's other projects (Rawdhati,
PureSmell), sharing one **host-level** nginx and one **host-level** certbot —
not a second Dockerized nginx. Read this before deploying; the shape here is
dictated by what's already running on the box, not a green-field choice.

---

## Why this shape (read before improvising)

The server already runs:
- **A system nginx** (`systemctl`, installed via apt — not Docker) bound to
  `0.0.0.0:80`/`443`, fronting two other projects via
  `/etc/nginx/sites-available/{rawdhaty,puresmell}.conf`.
- **Rawdhati** and **PureSmell**, each Dockerized, each binding its app
  container to `127.0.0.1:<port>` only (never a public port directly) and
  each with its own Postgres + (PureSmell) MinIO, also loopback-only.
- **Certbot** installed as a system package (`/usr/bin/certbot`), used via
  `certbot --nginx -d <domain>` per site — it edits the vhost file in place
  to add the 443 block, and system cron/systemd-timer handles renewal
  (standard certbot package behavior; nothing custom to set up).

3ers **must not** run its own containerized nginx or certbot — that would
either fail to bind 80/443 (already taken) or fight the system nginx for
those ports. Instead, 3ers follows the exact same pattern as the other two
projects: four app containers on loopback ports, four (well, five — see
below) nginx site files added to the existing `sites-available/`, TLS via the
existing system `certbot --nginx`.

## Port map (avoiding collisions with Rawdhati / PureSmell)

| Service | Host binding | Note |
|---|---|---|
| `invite` | `127.0.0.1:3900` | |
| `admin` | `127.0.0.1:3901` | |
| `portal` | `127.0.0.1:3902` | |
| `marketing` | `127.0.0.1:3903` | |
| `postgres` (3ers) | *(none published)* | only reachable inside the compose network, same as `rawdhati-postgres` |
| `minio` (3ers) | `127.0.0.1:9910` (S3 API), `127.0.0.1:9911` (console) | **not** 9000/9001 — those are already `puresmell-minio-1` on this host |

## URL map

| URL | Container | Notes |
|---|---|---|
| `celebrio-digital.com` (+ `www`) | `marketing` | Landing page at `/`; internally proxies `/{slug}` straight to `invite` over loopback (`INVITE_ORIGIN=http://127.0.0.1:3900` in `.env` — see `apps/marketing/next.config.ts`) |
| `invite.celebrio-digital.com` | `invite` | Direct/debug access; not what couples normally see |
| `admin.celebrio-digital.com` | `admin` | |
| `app.celebrio-digital.com` | `portal` | |
| `storage.celebrio-digital.com` | `minio` (3ers's, port 9910) | Public entry for presigned photo upload/download URLs |

---

## 1 · Configure environment

```bash
cp .env.example .env
```

Set real values — **no `changeme` left anywhere**:

| Variable | Notes |
|---|---|
| `POSTGRES_PASSWORD` | |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | |
| `ADMIN_NEXTAUTH_SECRET` / `PORTAL_NEXTAUTH_SECRET` | `openssl rand -base64 32` each, **different values**, never the dev placeholders |
| `MINIO_PUBLIC_URL` | Leave as `.env.example`'s default (`https://storage.celebrio-digital.com`) — this is what photo URLs are *signed* against |
| `INVITE_ORIGIN` | Leave as `.env.example`'s default (`http://127.0.0.1:3900`) |
| `RESEND_API_KEY` / `RESEND_FROM`, `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Real keys when ready; placeholders fine short-term (email/billing just won't work) |

`DATABASE_URL` and the app `*_URL` vars already default correctly for this
setup — leave them.

## 2 · Build and start the app containers

```bash
cd infra
docker compose build
docker compose up -d
docker compose ps   # everything should show "Up" / "healthy"
```

This starts 3ers's own `postgres` + `minio` (isolated from Rawdhati's and
PureSmell's — separate compose project, separate named volumes) plus the four
app containers, all on loopback ports per the table above. Nothing is
publicly reachable yet — that's the next step.

## 3 · Add the nginx site files

```bash
sudo cp infra/nginx/host/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/celebrio-digital.conf      /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/invite.celebrio-digital.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/admin.celebrio-digital.conf  /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/app.celebrio-digital.conf    /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/storage.celebrio-digital.conf /etc/nginx/sites-enabled/

sudo nginx -t          # must say "syntax is ok" / "test is successful"
sudo systemctl reload nginx
```

At this point all five domains serve **plain HTTP** (port 80 only — the
files ship with just the `listen 80` block, matching how `rawdhaty.conf` and
`puresmell.conf` looked before certbot touched them). Confirm before moving
on:

```bash
curl -I http://celebrio-digital.com/
curl -I http://admin.celebrio-digital.com/
```

## 4 · Issue TLS certificates

One `certbot --nginx` call per site — each one edits that site's file in
`sites-available/` in place, adding the `listen 443 ssl` block and rewriting
the `:80` block into a redirect (identical to how `rawdhaty.com` and
`yaz-scents.com` already look on this server):

```bash
sudo certbot --nginx -d celebrio-digital.com -d www.celebrio-digital.com
sudo certbot --nginx -d invite.celebrio-digital.com
sudo certbot --nginx -d admin.celebrio-digital.com
sudo certbot --nginx -d app.celebrio-digital.com
sudo certbot --nginx -d storage.celebrio-digital.com
```

Certbot will ask for an email (first run only, if not already configured)
and confirm the redirect-to-HTTPS choice — say yes. Renewal is handled by
whatever cron/systemd-timer certbot's package already installed on this
server (shared across all sites, nothing 3ers-specific to add) — confirm it
exists:

```bash
sudo systemctl list-timers | grep certbot
# or: crontab -l | grep certbot
```

## 5 · Verify

```bash
curl -I https://celebrio-digital.com/
curl -I https://celebrio-digital.com/fahmi-esmiralda      # showcase invitation, proxied via marketing
curl -I https://invite.celebrio-digital.com/fahmi-esmiralda # same invitation, direct
curl -I https://celebrio-digital.com/legal/privacy          # marketing's own route (not proxied)
curl -I https://admin.celebrio-digital.com/                 # redirects to /login
curl -I https://app.celebrio-digital.com/                   # redirects to /login
curl -I https://storage.celebrio-digital.com/minio/health/live
```

In a browser: open a live `/{slug}` on the apex with DevTools → Network open
— no 404s, JS chunks load from `/invite-static/_next/…`.

## 6 · Day-two operations

```bash
git pull
docker compose build <service>     # e.g. marketing
docker compose up -d <service>

docker compose logs -f invite
docker compose exec invite sh
docker compose down && docker compose up -d   # full restart
```

nginx config changes: edit the file in `/etc/nginx/sites-available/`
directly on the server (or re-copy from `infra/nginx/host/` and re-apply any
certbot edits certbot made — check `diff` first, don't blindly overwrite a
certbot-managed file), then `sudo nginx -t && sudo systemctl reload nginx`.

Postgres schema: `infra/postgres/init.sql` only runs on a **fresh** `pg_data`
volume (3ers's own, isolated from the other projects'). For later schema
changes, use Drizzle migrations.

---

## Known gaps to close before real traffic

- **Backups**: nothing backs up 3ers's `pg_data`/`minio_data` volumes yet —
  check whether this server already has a backup routine covering Rawdhati/
  PureSmell that 3ers should join, or add its own `pg_dump` cron.
- **Resend / Stripe**: still placeholder keys in `.env.example`.
- **No CI/CD**: deploys are the manual `git pull && docker compose build/up`
  sequence above.
- Confirm this server's disk/RAM headroom for a *third* project's worth of
  Postgres + MinIO + 4 Next.js containers before going live.

## Local replica (unaffected by any of the above)

`pnpm dev` in each app, no Docker, no nginx: invite `:3900`, admin `:3901`,
portal `:3902`, marketing `:3903` — `apps/marketing/.env.local` sets
`INVITE_ORIGIN=http://localhost:3900` so `http://localhost:3903/{slug}` is
the local equivalent of `https://celebrio-digital.com/{slug}`.
