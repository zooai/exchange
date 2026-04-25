# Zoo Exchange — Zoo Network DEX frontend (apps/web ONLY).
#
# Zoo-branded overlay of upstream luxfi/exchange SPA. Mobile app stays in
# apps/mobile and builds via Expo separately — not in this image.
#
# Target registry: ghcr.io/zooai/exchange:v{semver}
# Target hostname: zoo.exchange

# ─── Stage 1: Build the Vite SPA from luxfi/exchange (apps/web only) ─────
FROM node:22-alpine AS spa
RUN apk add --no-cache git python3 make g++
WORKDIR /app

# Pin UPSTREAM_REF to upstream HEAD past v5.146.0 — same as
# liquidityio/swap. Post-v5.146.0 fixes cleared the expo-modules-core
# breakage AND landed StatsigProvider repair, Web3Provider const→let,
# Vite envDefines filter, Docker apps/extension drop.
ARG UPSTREAM_REF=b252527656890c4c5bc80c7378b5755da89a65fe
RUN if git ls-remote --heads --tags https://github.com/luxfi/exchange.git "${UPSTREAM_REF}" | grep -q .; then \
      git clone --depth=1 --branch="${UPSTREAM_REF}" \
        https://github.com/luxfi/exchange.git .; \
    else \
      git clone https://github.com/luxfi/exchange.git . && \
      git checkout "${UPSTREAM_REF}"; \
    fi && \
    git rev-parse HEAD > /tmp/upstream-sha

# Overlay Zoo .env so Vite picks it up during install. Ship the
# committed `.env.defaults` (no secrets) — `.env` is gitignored and
# would not exist in CI build context.
COPY .env.defaults apps/web/.env.local

# Pull canonical Zoo brand.json + assets from @zooai/brand (source of
# truth at ~/work/zoo/brand, published to npm).
RUN apk add --no-cache curl && \
    mkdir -p /tmp/zb && cd /tmp/zb && \
    curl -sL "$(npm pack @zooai/brand@latest 2>/dev/null | tail -1 || echo /dev/null)" | tar -xz --strip-components=1 -C . 2>/dev/null || \
    (npm pack @zooai/brand@latest && tar -xzf zooai-brand-*.tgz --strip-components=1)
RUN cp /tmp/zb/brand.json apps/web/public/brand.json

# Zoo logo marks — bundled in brand-assets/ since @zooai/logo npm
# package only ships dist/ (JS code), not the SVG sources.
COPY brand-assets/logo.svg     apps/web/public/logo.svg
COPY brand-assets/favicon.svg  apps/web/public/favicon.svg
COPY brand-assets/wordmark.svg apps/web/public/wordmark.svg

# Zoo CSP — narrows connect/img/frame sources to Zoo-owned + standard wallet endpoints.
COPY csp.json apps/web/public/csp.json

# Zoo featured tokens on the landing page token cloud — 14 native Zoo
# (≥50%), 7 stocks (~25%), 7 private securities (~25%). Same shape as
# liquidityio/swap's approvedTokens override.
COPY featured-tokens.ts apps/web/src/pages/Landing/assets/approvedTokens.ts

# Patch index.html title + meta for Zoo — handles both upstream commits.
RUN sed -i \
      -e 's|<title>Exchange</title>|<title>Zoo Exchange \| Trade</title>|' \
      -e 's|<title>Uniswap Interface</title>|<title>Zoo Exchange \| Trade</title>|' \
      -e 's|content="Multi-chain decentralized exchange powered by Lux Network"|content="Trade ZOO and every token on Zoo Network."|' \
      apps/web/index.html || true

# Drop mobile + extension apps — web SPA only.
RUN rm -rf apps/mobile apps/extension && rm -f pnpm-lock.yaml

# Upstream bug at HEAD: pkgs/{utilities,lx,ui}/package.json reference
# "vitest-presets" (plural) but config/vitest-presets/package.json
# declares "@l.x/vitest-preset" (singular). pnpm fails. Rename to match.
RUN sed -i 's|"name": "@l\.x/vitest-preset"|"name": "vitest-presets"|' \
      config/vitest-presets/package.json 2>/dev/null || true

# Corepack + pnpm + install web workspace only.
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
RUN pnpm install --no-frozen-lockfile --ignore-scripts --filter "@l.x/web..."

# Stub postinstall-generated assets (we disabled scripts).
RUN mkdir -p node_modules/@rive-app/canvas apps/web/public/rive && \
    touch node_modules/@rive-app/canvas/rive.wasm \
          apps/web/public/rive/rive.wasm
RUN for d in tools/uniswap-nx apps/cli apps/extension apps/mobile packages/transactional packages/docker-image-builder; do \
      mkdir -p "$d" && echo '{"compilerOptions":{}}' > "$d/tsconfig.json"; \
    done

# Bundle react-native-reanimated instead of externalizing (Rollup fix).
RUN sed -i '/\/react-native-reanimated\/,$/d' apps/web/vite.config.mts

# Gitignored types + ABIs + AJV validators (web-only).
RUN cd pkgs/api && pnpm exec openapi \
      --input ./src/clients/trading/api.json \
      --output ./src/clients/trading/__generated__ \
      --useOptions --exportServices true --exportModels true \
    || (mkdir -p src/clients/trading/__generated__/models \
                 src/clients/trading/__generated__/core \
                 src/clients/trading/__generated__/services && \
        echo 'export {}' > src/clients/trading/__generated__/index.ts)
RUN mkdir -p pkgs/lx/src/abis/types/v3 && \
    echo 'export {}' > pkgs/lx/src/abis/types/v3/index.ts
RUN cd apps/web && pnpm exec node scripts/compile-ajv-validators.js || true

# Build web SPA.
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    DOCKER_BUILD=true \
    DISABLE_EXTRACTION=1 \
    NODE_OPTIONS="--max-old-space-size=8192"
RUN cd apps/web && pnpm exec vite build

# Final brand sweep — rewrite upstream lux.exchange URLs to Zoo equivalents
# so no lux-domain links leak into the Zoo bundle. Also kills any residual
# lux.org refs (legacy upstream Uniswap era).
RUN cd apps/web/build && \
    find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) \
      -exec sed -i \
        -e 's|https://lux\.exchange|https://zoo.exchange|g' \
        -e 's|https://docs\.lux\.exchange|https://docs.zoo.exchange|g' \
        -e 's|https://info\.lux\.exchange|https://info.zoo.exchange|g' \
        -e 's|https://gw\.lux\.exchange|https://gw.zoo.exchange|g' \
        -e 's|https://ws\.lux\.exchange|wss://ws.zoo.exchange|g' \
        -e 's|https://app\.lux\.org|https://zoo.exchange|g' \
        -e 's|https://lux\.org|https://zoo.exchange|g' \
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
