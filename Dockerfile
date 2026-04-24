# Zoo Exchange — trade ZOO and every token on Zoo Network.

# 1) Build the Vite bundle.
FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
RUN pnpm install --filter @zooai/exchange --frozen-lockfile --ignore-scripts
COPY apps/web apps/web
RUN cd apps/web && NODE_OPTIONS="--max-old-space-size=4096" pnpm exec vite build

# 2) Serve via hanzoai/spa (runtime config templating + reverse-proxy).
FROM ghcr.io/hanzoai/spa:1.2.0
COPY --from=build /app/apps/web/build /public
