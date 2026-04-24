# Zoo Exchange — AI Assistant Knowledge Base

**Last Updated**: 2026-04-23
**Repo**: `github.com/zooai/exchange` (branch: `main`)
**Live**: [zoo.exchange](https://zoo.exchange)
**Canonical upstream**: [luxfi/exchange](https://github.com/luxfi/exchange)
**License**: BSD-3-Clause — © Zoo Labs Foundation Inc.
**Upstream license**: GPL-3.0-or-later (consumed as a runtime npm dep only)

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
    {...brand} logo={Logo}
    chains={canonicalChains}  defaultChain={zooMainnet}
    dex={{ kind: 'gateway', url: 'https://dex.lux.network' }}
    provider={{ /* per-env Liquidity endpoints */ }}
    auth={{ provider: 'iam', issuer: 'https://iam.zoo.network', clientId: 'zoo-exchange', idHost: 'https://zoolabs.id' }}
    kms={{  url: 'https://kms.zoo.network' }}
    i18n={{ 'en-US': en, /* … */ }}
    features={{ nft: true, /* … */ }}
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
├── LICENSE                       # BSD-3-Clause © Zoo Labs Foundation Inc.
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
| DEX backend (layered: precompile → V3 → V2 → Warp) | `main.tsx` `dex` prop | `{ kind: 'gateway', url }` |
| regulated provider (Liquidity, per-env) | `main.tsx` `provider` prop | `{ name, endpoints: {…} }` |
| IAM login (iam.zoo.network / zoolabs.id) | `main.tsx` `auth` prop | `{ provider, issuer, clientId, idHost }` |
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

Each bridged to Lux (96369/96368/96370), Hanzo (36963/36964/36965), and Liquid EVM (8675309/8675310/8675311) via Lux Warp + MPC threshold signatures (see `~/work/lux/bridge`). Regulated digital-securities flow through the Liquidity provider gate on Liquid EVM.

## Canonical Zoo Bridge tokens (source of truth: `~/work/lux/bridge`)

All CREATE2-deterministic — same addresses across Zoo mainnet/testnet/devnet.

| symbol | address | name |
|---|---|---|
| ZOO (native) | `0x0000000000000000000000000000000000000000` | Zoo |
| ZLUX | `0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88` | Zoo LUX |
| ZETH | `0x60E0a8167FC13dE89348978860466C9ceC24B9ba` | Zoo ETH |
| ZBTC | `0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e` | Zoo BTC |
| ZUSD | `0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2` | Zoo Dollar |
| ZBNB | `0x6EdcF3645DeF09DB45050638c41157D8B9FEa1cf` | Zoo BNB |
| ZPOL | `0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9` | Zoo POL |
| ZCELO | `0x3078847F879A33994cDa2Ec1540ca52b5E0eE2e5` | Zoo CELO |
| ZFTM | `0x8B982132d639527E8a0eAAD385f97719af8f5e04` | Zoo FTM |
| ZAVAX | `0x7dfb3cBf7CF9c96fd56e3601FBA50AF45C731211` | Zoo AVAX |
| ZSOL | `0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7` | Zoo SOL |
| ZTON | `0x3141b94b89691009b950c96e97Bff48e0C543E3C` | Zoo TON |
| ZADA | `0x8b34152832b8ab4a3274915675754AA61eC113F0` | Zoo ADA |

### Zoo Mainnet AMM (deployed 2024)

| contract | address |
|---|---|
| WZOO | `0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E` |
| Multicall3 | `0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F` |
| V2 Factory | `0xD173926A10A0C4eCd3A51B1422270b65Df0551c1` |
| V2 Router | `0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511` |
| V3 Factory | `0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84` |
| V3 SwapRouter02 | `0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E` |
| V3 Quoter | `0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275` |
| V3 NFTPositionManager | `0x7a4C48B9dae0b7c396569b34042fcA604150Ee28` |

### Naming rules

- **On Zoo chain**, bridged LUX is `ZLUX` ("Zoo LUX") — **not** WLUX. WLUX is reserved for the ERC-20-wrapped-native on Lux chain itself.
- **On Lux chain**, the equivalents are L-prefix (LETH / LBTC / LUSD) — these are the **Liquid** synthetic debt tokens from the **Lux Liquid protocol** (`~/work/lux/liquid`, AlchemistV3). Self-repaying: users deposit yield-bearing collateral, borrow the synthetic, and yield auto-repays the debt via a Transmuter.

## DEX backend — V2 + V3 + precompile + Warp (layered)

`dex={{ kind: 'gateway', url: 'https://dex.lux.network' }}` → gateway internally layers all available backends on the target chain in order of speed/cost:

1. **Lux DEX precompile** (LP-9010 family) — native sub-microsecond matching (Zoo mainnet/testnet/devnet, Lux mainnet/testnet/devnet)
2. **V3 concentrated liquidity AMM** (`V3_FACTORY` / `V3_SWAP_ROUTER_02` / `V3_QUOTER`) — fallback when precompile absent or LP-less
3. **V2 constant-product AMM** (`V2_FACTORY` / `V2_ROUTER`) — widest pair coverage
4. **Cross-chain routing** via Warp + MPC (to Ethereum, Base, Polygon, BNB, Avalanche, Solana, Cosmos, etc.)

Advanced apps can bypass gateway and use explicit `{ kind: 'layered', layers: [...] }` to pin a specific fallback order.

## Regulated-asset gate (Liquidity) — per-env endpoints

Stocks (AAPL, MSFT, NVDA, TSLA, GOOGL, AMZN, META) + private securities (OpenAI, Anthropic, SpaceX, Stripe) are **BOTH** regulated. Each trade routes through the Liquidity provider on Liquid EVM — KYC + accreditation enforced. Each Liquid env has its own ATS deployment with distinct adapter/router contracts + onboarding host:

| Liquid chain | chainId | onboarding |
|---|---|---|
| Liquid Mainnet | 8675309 | `https://id.satschel.com/onboarding` |
| Liquid Testnet | 8675310 | `https://id.test.satschel.com/onboarding` |
| Liquid Devnet | 8675311 | `https://id.dev.satschel.com/onboarding` |

Declared in `main.tsx` as `provider={{ name: 'Liquidity', endpoints: { [chainId]: { adapter, router, onboardingUrl }, … } }}`.

## Featured tokens — 50% stocks / 25% private / 25% native Zoo

28-token composition for BlackRock-grade digital-securities demo:

- **50% stocks** (regulated): AAPL, MSFT, NVDA, TSLA, GOOGL, AMZN, META
- **25% private** (regulated): OPENAI, ANTHROPIC, SPACEX, STRIPE
- **25% native Zoo**: ZOO, ZLUX, ZETH, ZBTC, ZUSD (canonical Z-prefix from `~/work/lux/bridge`)

## Bridge + Teleport

Cross-chain via [`~/work/lux/bridge`](https://github.com/luxfi/bridge) — MPC 2-of-3 threshold custody, Warp cross-chain messaging, and 15+ source chain integrations:
- **Zoo ↔ Lux**: native Warp (sub-second finality, shared quantum finality via Q-Chain)
- **Zoo ↔ Hanzo**: Warp (AI-chain interop)
- **Zoo ↔ Liquid EVM**: Warp + KYC attestation passthrough (regulated assets)
- **Zoo ↔ external EVMs**: `dex.lux.network` gateway (Circle CCTP, LayerZero, Wormhole, etc.)

Zoo-side bridge contracts deployed in `~/work/zoo/contracts` via `broadcast/DeployZooBridge.s.sol/200200/`, `200201/`, `200202/`.

## Build & deploy

```bash
# Build Docker image (pinned upstream commit + Zoo overlays)
docker build -t ghcr.io/zooai/exchange:v1.x.x .

# Tag triggers CI → universe dispatch → K8s rollout
git tag web/5.x.x
git push origin web/5.x.x
```

CI: `.github/workflows/docker-publish.yml` uses hanzo ARC runners (`hanzo-build-linux-amd64`/`arm64`). Universe dispatches on tag push to `zooai/universe` for auto-deploy.

Runtime image: `ghcr.io/hanzoai/spa:1.2.0` (tiny static server + `/config.json` templating + reverse-proxy). K8s ConfigMap provides `SPA_*` env vars templated into `/config.json` at pod startup.

## Known issues (2026-04-23)

1. **Hanzo ARC runners** — `startup_failure` on every CI run since 2026-04-22. Ops fix needed; Dockerfile is correct.
2. **`@luxfi/exchange` App runtime** — types + examples + `ExchangeConfig` shape all landed on `luxfi/exchange` branch `sdk-shell-api`. Runtime that consumes these props into `ExchangeContext` + wires into providers/router/i18n/wagmi still pending — ships as `@luxfi/exchange@1.0.9` when done.
3. **Hanzo/Pars AMM deploy** — canonical chain defs include Hanzo (36963/36964/36965) and Pars (494949/7071/7072) but the V2/V3 factory+router + bridge tokens aren't deployed yet. Run `DeployMultiNetwork.s.sol` from `~/work/lux/standard` with `$LUX_MNEMONIC` pointed at each chain's RPC.
4. **Live site stale** — serving 2026-03-09 build (pre-my-session). Every fix is committed + pushed; production rolls when CI runs green.

## Rules for AI assistants

1. **NEVER commit `CLAUDE.md`** — it's a symlink to `LLM.md`. Only edit `LLM.md`.
2. **NEVER duplicate brand / chain / logo / token data** — single canonical source per concern. Bridge tokens come from `~/work/lux/bridge` (authoritative registry).
3. **PREFER the declarative SDK pattern** — one `<Exchange {...config} />`, no imperative `register()`, no state machines, no global mutation.
4. **KEEP zoo/exchange thin** — if code doesn't have a `zoo.`-specific reason to exist here, it belongs upstream in `luxfi/exchange`.
5. **NO hardcoded absolute paths** — `path.resolve(__dirname, …)` only. No `/Users/z/…`.
6. **Version policy**: `@luxfi/exchange` stays on 1.x (no 2.0 bump). `@zooai/brand` bumps minor per non-breaking content change.
7. **License**: BSD-3-Clause for this repo, © Zoo Labs Foundation Inc. Upstream `@luxfi/exchange` stays GPL-3.0-or-later (runtime dep only).
8. **Liquid vs Zoo naming**: LETH/LBTC/LUSD = Liquid ETH/BTC/USD (Lux chain, Lux Liquid protocol). ZETH/ZBTC/ZUSD/ZLUX = Zoo versions (Zoo chain bridge).

## Contact

- X: [@zoo_labs](https://x.com/zoo_labs)
- Discord: [discord.gg/edmZPTZjH9](https://discord.gg/edmZPTZjH9)
- Email: [hi@zoo.exchange](mailto:hi@zoo.exchange)
