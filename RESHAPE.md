# Reshape — Zoo Exchange SDK-consumer pattern

## Inventory (2026-05-21)

| Surface | Pre-reshape state |
|---|---|
| Path | `~/work/zoo/exchange` (GitHub org `zooai`, repo `zooai/exchange`) |
| Branch | `main`, clean tree |
| Shape | Already SDK-consumer (`apps/web` + `apps/mobile`); 80-line `main.tsx`; deps `@luxfi/exchange@^1.0.8`, `@zooai/brand@^1.2.0`, `@zooai/logo@^1.0.0` |
| Dockerfile | Multi-stage Vite build → `ghcr.io/hanzoai/spa:1.2.0` runtime — already canonical |
| pnpm workspace | `apps/*` only — no in-repo packages |
| Mobile | `@zooai/exchange-mobile` consuming `@luxfi/mobile@^1.0.0` |

## SDK choice — decision

**Path A (chosen):** `@luxfi/exchange` is the canonical Lux-ecosystem exchange SDK.

Rationale:
- `@luxfi/exchange@1.0.9` is published on the public npm registry; ships
  `canonicalChains`, `zooMainnet`, `liquidMainnet`, `LIQUID_*_ID`,
  Tamagui+wagmi+router runtime — drop-in for Zoo.
- `@liquidityio/exchange` is **not** published (`npm view ...` → 404).
  Liquidity's exchange SPA at `~/work/liquidity/exchange/apps/web` is
  a giant in-tree app, not an installable SDK. Even if it were,
  Liquidity is jurisdiction-specific (US ATS/BD/TA) — Zoo is a
  jurisdiction-neutral Lux-ecosystem network, so coupling Zoo's
  client to a Liquidity SDK is the wrong axis.
- Path B (fork to `@luxfi/exchange`) is moot — that's already what
  exists and what Zoo consumes.

## Changes

| File | Before | After |
|---|---|---|
| `apps/web/src/main.tsx` | 132 lines, declared `LIQUID_MAINNET/TESTNET/DEVNET` locally, comments said "Liquidity provider gate" | 120 lines, imports `liquidMainnet, liquidTestnet, liquidDevnet, LIQUID_MAINNET_ID, LIQUID_TESTNET_ID, LIQUID_DEVNET_ID` from `@luxfi/exchange`, jurisdiction-neutral "regulated securities provider" wording |
| `apps/web/package.json` | `@luxfi/exchange@^1.0.8` | `@luxfi/exchange@^1.0.9` (latest patch) |
| `LLM.md` | "regulated provider (Liquidity, per-env)" + table "Liquidity Mainnet ..." with `id.satschel.com` urls | "regulated provider (per-env)" + jurisdiction-neutral wording; mentions Liquid EVM chain IDs (immutable, from SDK) without "Liquidity"/"satschel" brand text |
| `README.md` | "Liquidity SecurityToken gate" | "Regulated securities gate" |

## Bridge — same pattern

`~/work/zoo/bridge` was already a Go reverse-proxy (`main.go`) for the
upstream `ghcr.io/luxfi/bridge-server`. The frontend shim now lands as
`app/` — Dockerfile overlays `public/brand.json` onto the upstream
`ghcr.io/luxfi/bridge3:latest` image. Zero JS code in the shim; pure
declarative brand config.

| File | Status |
|---|---|
| `app/package.json` (`@zooai/bridge`) | committed |
| `app/Dockerfile` (overlay onto `ghcr.io/luxfi/bridge3`) | committed |
| `app/public/brand.json` (Zoo brand) | committed |
| `app/README.md` | committed |
| `app/scripts/validate-brand.mjs` | committed |

## Line counts

| Path | Before | After |
|---|--:|--:|
| `apps/web/src/main.tsx` | 132 | 120 |
| `apps/web/package.json` | 30 | 30 |
| `LLM.md` | 206 | 198 |
| `README.md` | 111 | 109 |

Total committed bridge `app/`: 4 files, ~120 LOC (entirely declarative — no JS bundle).

## Cross-brand isolation — verified

- No `satschel` references in any source file.
- "Liquidity" appears only in upstream SDK-internal chain definitions
  (read-only — `@luxfi/exchange/dist/chains/canonical.js`).
- `LIQUID_*_ID` symbols are imported from the SDK; not redeclared locally.
- "Lux" appears only in `@luxfi/...` package names, which is canonical
  per the workspace rules.

## Blockers

None. Brand assets (logo, favicon, wordmark) ship via `@zooai/brand` +
`@zooai/logo` from npm — no broken refs.
