# Zoo Exchange — Zoo Network DEX frontend (apps/web ONLY).
#
# Zoo-branded overlay of upstream luxfi/exchange SPA. Mobile lives in
# apps/mobile and builds via Expo separately — not in this image.
#
# Target registry: ghcr.io/zooai/exchange:v{semver}
# Target hostname: zoo.exchange
#
# Thin Dockerfile by design: clone upstream, overlay brand + assets,
# run the upstream build. Build-system fixes live upstream (luxfi/
# exchange PR#23) so every white-label benefits.

# ─── Stage 1: Build the Vite SPA from luxfi/exchange (apps/web only) ─────
FROM node:22-alpine AS spa
RUN apk add --no-cache git python3 make g++ curl
WORKDIR /app

# Pin UPSTREAM_REF to a commit on luxfi/exchange/main that includes
# PR#23 (kill @hanzogui/react-native-reanimated fork, fix lxOrder
# no-arg crash, rename vitest/jest-presets, env-driven graph + insights).
ARG UPSTREAM_REF=e73a76ef5dc6a5773cd4a28d5ba348cb8d2f9970
RUN if git ls-remote --heads --tags https://github.com/luxfi/exchange.git "${UPSTREAM_REF}" | grep -q .; then \
      git clone --depth=1 --branch="${UPSTREAM_REF}" \
        https://github.com/luxfi/exchange.git .; \
    else \
      git clone https://github.com/luxfi/exchange.git . && \
      git checkout "${UPSTREAM_REF}"; \
    fi && \
    git rev-parse HEAD > /tmp/upstream-sha

# Overlay Zoo .env so Vite picks it up. Ship .env.defaults (no secrets).
COPY .env.defaults apps/web/.env.local

# Pull canonical Zoo brand.json from @zooai/brand (~/work/zoo/brand on npm).
RUN mkdir -p /tmp/zb && cd /tmp/zb && \
    curl -sL "$(npm pack @zooai/brand@latest 2>/dev/null | tail -1 || echo /dev/null)" | tar -xz --strip-components=1 -C . 2>/dev/null || \
    (npm pack @zooai/brand@latest && tar -xzf zooai-brand-*.tgz --strip-components=1)
RUN cp /tmp/zb/brand.json apps/web/public/brand.json

# Zoo logo marks — bundled in brand-assets/ since @zooai/logo only ships dist.
COPY brand-assets/logo.svg     apps/web/public/logo.svg
COPY brand-assets/favicon.svg  apps/web/public/favicon.svg
COPY brand-assets/wordmark.svg apps/web/public/wordmark.svg

# Zoo CSP narrows connect/img/frame sources to Zoo-owned + standard wallet.
COPY csp.json apps/web/public/csp.json

# Zoo featured tokens for the landing-page token cloud.
COPY featured-tokens.ts apps/web/src/pages/Landing/assets/approvedTokens.ts

# Title rewrite.
RUN sed -i \
      -e 's|<title>Uniswap Interface</title>|<title>Zoo Exchange \| Trade</title>|' \
      -e 's|content="Multi-chain decentralized exchange powered by Lux Network"|content="Trade ZOO and every token on Zoo Network."|' \
      apps/web/index.html

# Drop mobile + extension apps — web SPA only.
RUN rm -rf apps/mobile apps/extension

# Corepack + pnpm + filtered install.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
RUN pnpm install --no-frozen-lockfile --ignore-scripts --filter "@l.x/web..."

# Generated artifacts the upstream tree expects but doesn't ship in git.
RUN mkdir -p node_modules/@rive-app/canvas apps/web/public/rive && \
    touch node_modules/@rive-app/canvas/rive.wasm \
          apps/web/public/rive/rive.wasm
RUN cd pkgs/api && pnpm exec openapi \
      --input ./src/clients/trading/api.json \
      --output ./src/clients/trading/__generated__ \
      --useOptions --exportServices true --exportModels true \
    || (mkdir -p src/clients/trading/__generated__/{models,core,services} && \
        echo 'export {}' > src/clients/trading/__generated__/index.ts)
RUN mkdir -p pkgs/lx/src/abis/types/v3 && \
    echo 'export {}' > pkgs/lx/src/abis/types/v3/index.ts
RUN cd apps/web && pnpm exec node scripts/compile-ajv-validators.js || true

# Build.
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    DOCKER_BUILD=true \
    DISABLE_EXTRACTION=1 \
    NODE_OPTIONS="--max-old-space-size=8192"
RUN cd apps/web && pnpm exec vite build

# Final brand sweep — guard against any residual lux.exchange / Uniswap
# strings in the shipping bundle.
RUN cd apps/web/build && \
    find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) \
      -exec sed -i \
        -e 's|https://lux\.exchange|https://zoo.exchange|g' \
        -e 's|https://docs\.lux\.exchange|https://docs.zoo.exchange|g' \
        -e 's|https://info\.lux\.exchange|https://info.zoo.exchange|g' \
        -e 's|https://gw\.lux\.exchange|https://gw.zoo.exchange|g' \
        -e 's|https://ws\.lux\.exchange|wss://ws.zoo.exchange|g' \
        -e 's|Lux Exchange|Zoo Exchange|g' \
        -e 's|Uniswap Interface|Zoo Exchange \| Trade|g' \
        {} + 2>/dev/null || true

# ─── Stage 2: Runtime via hanzoai/spa ─────────────────────────────────────
FROM ghcr.io/hanzoai/spa:1.2.0 AS runner
COPY --from=spa /app/apps/web/build /public
COPY --from=spa /tmp/upstream-sha /public/.upstream-sha

ENV SITE_NAME="Zoo Exchange" \
    BRAND_NAME=Zoo \
    LISTEN=:3000
EXPOSE 3000
