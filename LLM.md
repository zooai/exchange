# Zoo Exchange — AI Assistant Knowledge Base

**Last Updated**: 2026-04-23
**Repo**: `github.com/zooai/exchange` (branch: `main`)
**Live**: [zoo.exchange](https://zoo.exchange)
**Canonical upstream**: [luxfi/exchange](https://github.com/luxfi/exchange)

## What this repo is

A **thin white-label shim** over [`@luxfi/exchange`](https://www.npmjs.com/package/@luxfi/exchange) — the canonical Lux-ecosystem DEX SDK. The entire Zoo Exchange SPA is composed via a single React component with props.

```tsx
// apps/web/src/main.tsx
import { createRoot } from 'react-dom/client'
import Exchange, { canonicalChains, zooMainnet } from '@luxfi/exchange'
import brand from '@zooai/brand'
import Logo  from '@zooai/logo'
import en from '@zooai/brand/translations/en-US.json'
// …

createRoot(document.getElementById('root')!).render(
  <Exchange
    {...brand}
    logo={Logo}
    chains={canonicalChains}      // lux + hanzo + zoo + liquid (all 3 envs)
    defaultChain={zooMainnet}
    dex={{ kind: 'precompile' }}
    provider={{ /* Liquidity / Alpaca gate */ }}
    auth={{   provider: 'iam', issuer: 'https://iam.zoo.network', … }}
    kms={{    url:      'https://kms.zoo.network' }}
    i18n={{   'en-US': en, 'es-ES': es, 'zh-CN': zh }}
    features={{ nft: true, … }}
    featured={[ /* 50% stocks (AAPL…) / 25% private (OpenAI…) / 25% native Zoo */ ]}
  />,
)
```

## Repo shape (Marie-Kondo cleanup 2026-04-23)

```
zooai/exchange/
├── Dockerfile                    # build from pinned luxfi/exchange + Zoo overlays
├── .env                          # Vite build-time defaults
├── csp.json                      # Zoo-scoped CSP (*.zoo.exchange, *.zoo.network, …)
├── featured-tokens.ts            # landing-page token cloud (Docker overlay path)
├── apps/
│   ├── web/                      # thin TS shim — main.tsx, index.html, vite.config
│   └── mobile/                   # Expo iOS + Android
├── package.json                  # 4 devDeps, 1 script (mobile delegate)
├── pnpm-workspace.yaml           # apps/*
├── README.md
├── LLM.md (this file)
├── CLAUDE.md → LLM.md (symlink)
├── AGENTS.md → LLM.md (symlink)
├── LICENSE
└── VERSION
```

No `src/`, `pkgs/`, `contracts/`, `subgraphs/`, `deploy/`, `config/`, or `tools/`. The SPA bundle builds from upstream pinned commit at Docker build time.

## Separation of concerns — every field has exactly one home

| concern | home | how |
|---|---|---|
| visual identity (colors, fonts, emails, socials, legal, domains) | `@zooai/brand@1.3.0` (pure) | spread `{...brand}` |
| logo marks (mono / color / wordmark / favicon) | `@zooai/logo@1.0.0` | `<Exchange logo={Logo} />` |
| per-locale translations | `@zooai/brand/translations/*.json` | `i18n={{ 'en-US': en, … }}` |
| canonical chain defs (lux/hanzo/zoo/liquid × 3 envs) | `@luxfi/exchange` | `chains={canonicalChains}` |
| Exchange App + SDK + providers + router + wagmi + `@hanzo/gui` bones | `@luxfi/exchange` | default import |
| DEX backend | `main.tsx` `dex` prop | `{ kind: 'precompile' \| 'v3' \| 'gateway' \| custom }` |
| regulated provider (Liquidity / Alpaca) | `main.tsx` `provider` prop | `{ adapter, router, onboardingUrl }` |
| IAM login (iam.zoo.network / zoolabs.id) | `main.tsx` `auth` prop | `{ provider: 'iam', issuer, clientId, idHost }` |
| KMS (kms.zoo.network) | `main.tsx` `kms` prop | `{ url }` |
| feature toggles | `main.tsx` `features` prop | `{ swap, pool, nft, … }` |
| featured tokens | `main.tsx` `featured` prop OR `featured-tokens.ts` | array of `TokenRef` |
| custom routes | `main.tsx` `routes` prop | `[{ path, component }]` |
| custom widgets | `main.tsx` `widgets` prop | `[{ slot, component }]` |

## Three networks (all enabled)

| env | chain id | RPC |
|---|---|---|
| Zoo Mainnet | 200200 | `https://api.zoo.network/rpc` |
| Zoo Testnet | 200201 | `https://api.zoo-test.network/rpc` |
| Zoo Devnet | 200202 | `https://api.zoo-dev.network/rpc` |

Each bridged to Lux (96369/96368/96370) via Lux Teleport + Warp for cross-chain swap/send, and to Liquid EVM (8675309/8675310/8675311) for regulated digital-securities trading behind the Liquidity provider gate.

## Deployed Zoo Mainnet contracts (2026-03-04)

| contract | address |
|---|---|
| WLUX | `0x5491216406daB99b7032b83765F36790E27F8A61` |
| MULTICALL | `0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F` |
| LETH (bridged) | `0x4870621EA8be7a383eFCfdA225249d35888bD9f2` |
| LBTC (bridged) | `0x6fc44509a32E513bE1aa00d27bb298e63830C6A8` |
| LUSD (bridged) | `0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D` |
| V2_FACTORY | `0xF034942c1140125b5c278aE9cEE1B488e915B2FE` |
| V2_ROUTER | `0x2cd306913e6546C59249b48d7c786A6D1d7ebE08` |

Deployer: `0x9011E888251AB053B7bD1cdB598Db4f9DEd94714`.

## Featured tokens — 50% stocks / 25% private / 25% native Zoo

28-token composition for BlackRock-grade digital-securities demo:

- **50% stocks**: AAPL, MSFT, NVDA, TSLA, GOOGL, AMZN, META (Alpaca-gated)
- **25% private**: OPENAI, ANTHROPIC, SPACEX, STRIPE (regulated provider gated)
- **25% native Zoo**: ZOO (native), WLUX, LETH, LBTC, LUSD (deployed addresses above)

Stocks + private route through the Liquidity regulated provider on Liquid EVM; native Zoo trades through Lux DEX precompiles (LP-9010 family).

## Bridge + Teleport

Cross-chain via [`~/work/lux/bridge`](https://github.com/luxfi/bridge):
- **Zoo ↔ Lux**: native Warp messaging (sub-second finality)
- **Zoo ↔ Liquid EVM**: Warp + compliance attestations (regulated assets require KYC proof passthrough)
- **Zoo ↔ external EVMs**: via `dex.lux.network` gateway (Circle CCTP, LayerZero, etc.)

Contract deployments for Zoo side of the bridge are in `~/work/zoo/contracts` (`broadcast/DeployZooBridge.s.sol/200200/`).

## Build & deploy

```bash
# Build Docker image (pinned upstream commit + Zoo overlays)
docker build -t ghcr.io/zooai/exchange:v1.x.x .

# Tag triggers CI → universe dispatch → K8s rollout
git tag web/5.x.x
git push origin web/5.x.x
```

CI: `.github/workflows/docker-publish.yml` uses hanzo ARC runners (`hanzo-build-linux-amd64`/`arm64`). Universe dispatches on tag push to `zooai/universe` for auto-deploy.

Runtime image: `ghcr.io/hanzoai/spa:1.2.0` (tiny static server + `/config.json` templating + reverse-proxy). K8s ConfigMap provides `SPA_*` env vars which get templated into `/config.json` at pod startup.

## Known issues (2026-04-23)

1. **Hanzo ARC runners** — `startup_failure` on every CI run since 2026-04-22. Ops fix needed. Dockerfile is correct; blocked on runner infra.
2. **`@luxfi/exchange` App runtime** — types + examples + `ExchangeConfig` shape all landed on `luxfi/exchange` branch `sdk-shell-api`. Runtime that consumes these props into `ExchangeContext` + wires into providers/router/i18n/wagmi still pending — move `apps/web/src/{index.tsx, App.tsx, RouteDefinitions.tsx, providers/*}` → `pkgs/exchange/src/`. Ships as `@luxfi/exchange@1.0.9` when done.
3. **Live site stale** — serving 2026-03-09 build (pre-my-session). Every fix is committed + pushed; production rolls when CI runs green.

## Rules for AI assistants

1. **NEVER commit `CLAUDE.md`** — it's a symlink to `LLM.md`. Only edit `LLM.md`.
2. **NEVER duplicate brand / chain / logo / token data** — single canonical source per concern.
3. **PREFER the declarative SDK pattern** — one `<Exchange {...config} />`, no imperative `register()`, no state machines, no global mutation.
4. **KEEP zoo/exchange thin** — if code doesn't have a `zoo.`-specific reason to exist here, it belongs upstream in `luxfi/exchange`.
5. **NO hardcoded absolute paths** — `path.resolve(__dirname, …)` only. No `/Users/z/…`.
6. **Version policy**: `@luxfi/exchange` stays on 1.x (no 2.0 bump). `@zooai/brand` bumps minor per non-breaking content change.

## Contact

- X: [@zoo_labs](https://x.com/zoo_labs)
- Discord: [discord.gg/edmZPTZjH9](https://discord.gg/edmZPTZjH9)
- Email: [hi@zoo.exchange](mailto:hi@zoo.exchange)
