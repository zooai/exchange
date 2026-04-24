# Zoo Exchange

[**zoo.exchange**](https://zoo.exchange) — trade **ZOO** and every token on
Zoo Network. The canonical **white-label example** for `@luxfi/exchange`.

Two patterns coexist here. Pick the one that matches your stack.

---

## Pattern 1 — TS shim (target architecture)

```tsx
// apps/web/src/main.tsx — 10 lines
import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
```

Extend via one `register()` API:

```ts
Exchange.register({ chains:   [zooMainnet, zooTestnet] })
Exchange.register({ features: { nft: false } })
Exchange.register({ auth:     { provider: 'iam', issuer: 'https://iam.zoo.network', clientId: 'zoo-exchange', idHost: 'https://zoolabs.id' } })
Exchange.register({ route:    { path: '/stake', component: ZooStakePage } })
Exchange.register({ widget:   { slot: 'landing.hero', component: ZooHero } })
```

See [`apps/web/src/main.tsx`](apps/web/src/main.tsx) + [`@luxfi/exchange` README](https://github.com/luxfi/exchange/tree/main/pkgs/exchange) for the full register payload catalog.

**Status:** requires `@luxfi/exchange` to default-export the App + `register()` runtime. That runtime is not yet published — shape + types are at [`luxfi/exchange` branch `sdk-shell-api`](https://github.com/luxfi/exchange/tree/sdk-shell-api). Once landed + published, `pnpm --dir apps/web build` goes green and this is the production path.

## Pattern 2 — Docker overlay (production today)

[`Dockerfile`](Dockerfile) builds zoo.exchange from pinned upstream
`luxfi/exchange@08e544ea1b` + Zoo overlays:

| overlay | source | effect |
| --- | --- | --- |
| `brand.json` | pulled from `@zooai/brand@latest` on npm at build time | runtime brand config — emails, twitter, discord, chain defaults, IAM, KMS |
| `csp.json` | [`csp.json`](csp.json) | Content-Security-Policy scoped to Zoo hosts + IAM + KMS + DEX + WalletConnect |
| `brand-assets/{logo,favicon,wordmark}.svg` | from [`@zooai/logo`](https://www.npmjs.com/package/@zooai/logo) (source: `~/work/zoo/logo`) | Zoo monochrome marks |
| `featured-tokens.ts` | [`featured-tokens.ts`](featured-tokens.ts) | landing-page token cloud: 14 native Zoo / 7 stocks / 7 private = 28 tokens (50/25/25) |
| `.env` | [`.env`](.env) | Vite build-time defaults (chainId 200200, iam org=zoo) |

Docker's final `sed` sweep rewrites any residual `lux.exchange` /
`lux.org` / `Uniswap Interface` strings in the bundle to Zoo equivalents.

Runtime image: `ghcr.io/hanzoai/spa:1.2.0` — tiny static server +
`/config.json` templating + reverse-proxy. K8s ConfigMap can override
`/config.json` at pod startup for per-env (RPC, IAM, KMS, gateway).

**Build:** `docker build -t ghcr.io/zooai/exchange:v1.x.x .`  
**Deploy:** push tag → universe dispatch → DOKS rollout.

---

## Packages on npm (canonical upstream at [luxfi/exchange](https://github.com/luxfi/exchange))

| package | version | source of truth |
| --- | --- | --- |
| [`@luxfi/exchange`](https://www.npmjs.com/package/@luxfi/exchange) | `1.0.8` | `luxfi/exchange/pkgs/exchange` |
| [`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand) | `1.1.0` | `zoo-labs/brand` (canonical: `~/work/zoo/brand`) |
| [`@zooai/logo`](https://www.npmjs.com/package/@zooai/logo) | `1.0.0` | `zoo-labs/logo` (canonical: `~/work/zoo/logo`) |

## Mobile

[`apps/mobile/`](apps/mobile) — Expo. Consumes `@l.x/*`, `@luxfi/wallet`,
`@zooai/brand`, `@zooai/logo` from npm.

```bash
pnpm --dir apps/mobile ios       # iOS simulator
pnpm --dir apps/mobile android   # Android emulator
```

## Contact

- X: [@zoo_labs](https://x.com/zoo_labs)
- Discord: [discord.gg/edmZPTZjH9](https://discord.gg/edmZPTZjH9)
- Email: [hi@zoo.exchange](mailto:hi@zoo.exchange)

## License

GPL-3.0-or-later.
