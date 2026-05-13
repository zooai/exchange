# Zoo Network Exchange — SDK-consumer build.
#
# Standard Vite SPA build. Installs deps from GAR (npm scope mirror),
# runs `pnpm build`, serves the static output via ghcr.io/hanzoai/spa.
# No upstream clone, no overlay, no brand-assets folder. Branding,
# logo, and translations come from @zooai/{brand,logo} npm
# packages. SDK comes from @luxfi/exchange.

# ─── Build stage ─────────────────────────────────────────────────────
FROM node:22-alpine AS build
RUN apk add --no-cache git
WORKDIR /app

# Workspace skeleton + per-app manifest. Lockfile (if any) lands first
# for layer caching; we use --no-frozen-lockfile because the lock is
# regenerated from upstream npm resolution.
COPY .npmrc package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/package.json
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
ARG NPM_AUTH_TOKEN
ENV NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN
RUN pnpm install --no-frozen-lockfile --filter @zooai/exchange-web...

# Source + build
COPY apps/web/. apps/web/
RUN cd apps/web && pnpm exec vite build

# ─── Runtime: static SPA via hanzoai/spa ────────────────────────────
FROM ghcr.io/hanzoai/spa:1.2.0
COPY --from=build /app/apps/web/build /public
