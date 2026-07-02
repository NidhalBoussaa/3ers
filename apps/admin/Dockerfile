# syntax=docker/dockerfile:1
# Multi-stage build for @3ers/admin — run from the MONOREPO ROOT:
#   docker build -f apps/admin/Dockerfile -t 3ers-admin .
# (docker-compose.yml already sets context: .. so this is automatic there.)

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate
WORKDIR /repo

# ---- deps: install once with full workspace context for correct hoisting ----
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/invite/package.json apps/invite/package.json
COPY apps/marketing/package.json apps/marketing/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/portal/package.json apps/portal/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
# --filter='!3ers' excludes the root package's devDependencies (playwright, turbo)
# from this build image — they're dev/CI tooling, not needed to build or run.
RUN pnpm install --frozen-lockfile --filter='!3ers'

# ---- build: bring in source, build only this app + its workspace deps ----
FROM deps AS build
COPY packages ./packages
COPY apps/admin ./apps/admin
RUN pnpm --filter @3ers/admin... build

# ---- runtime: Next standalone output only, non-root, no build tools ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /repo/apps/admin/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /repo/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=build --chown=nextjs:nodejs /repo/apps/admin/public ./apps/admin/public

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/admin/server.js"]
