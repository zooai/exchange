# Lux Exchange - White-Label DEX
# Target: <2min builds with layer caching

# Stage 1: Dependencies (cached unless package.json/lockfile changes)
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy ONLY dependency manifests first — maximizes cache hits
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY pkgs/provider/package.json pkgs/provider/

# Install deps — this layer is cached unless manifests change
RUN NODE_ENV=development pnpm install --no-frozen-lockfile --ignore-scripts

# Stage 2: Build (cached unless source changes)
FROM deps AS builder
WORKDIR /app

# Copy source code (separate from deps for caching)
COPY . .

# Rebuild native modules and run postinstall scripts now that source is available
RUN pnpm rebuild || true

# App-level codegen (package-level codegen lives in the published @l.x/* / @luxfi/* packages)
RUN cd apps/web && pnpm exec node scripts/compile-ajv-validators.js || true

# Build — brand-neutral
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production DOCKER_BUILD=true
RUN cd apps/web && DISABLE_EXTRACTION=1 NODE_OPTIONS="--max-old-space-size=8192" pnpm exec vite build

# Stage 3: Runtime — hanzoai/spa serves the Vite SPA, templates /config.json from
# SPA_* pod env at startup, and reverse-proxies PROXY_<PREFIX>=<upstream> routes.
FROM ghcr.io/hanzoai/spa:1.2.0
COPY --from=builder /app/apps/web/build /public
