# Zoo Exchange

[zoo.exchange](https://zoo.exchange) — Zoo Network's DEX. A thin shim
over [`@luxfi/exchange`](https://www.npmjs.com/package/@luxfi/exchange).

## The whole app

```tsx
// apps/web/src/main.tsx
import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
```

That's it. The rest (providers, router, swap/pool/portfolio, wagmi,
Tamagui bones via `@hanzo/gui`, Insights telemetry, i18n, theme) lives
upstream in `@luxfi/exchange` — one canonical home at
[luxfi/exchange](https://github.com/luxfi/exchange).

## Customize

Zoo-specific routes, widgets, chains, and regulated-provider adapters
register through a **single** `register` API:

```ts
import Exchange from '@luxfi/exchange'

Exchange.register({ route:    { path: '/stake', component: ZooStakePage } })
Exchange.register({ widget:   { slot: 'swap.footer', component: ZooPromo } })
Exchange.register({ chain:    zooMainnet })
Exchange.register({ provider: { adapter, router, onboardingUrl } })
```

Separation of concerns is the register *payload*, not a second surface
— one way to extend the app.

## Brand

Brand lives at [`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand)
(source at `~/work/zoo/brand`). Logo, colors, fonts, chainId, RPC.

Changing the brand = bump `@zooai/brand`, rebuild the image. Zero code
changes in this repo.

## Mobile

```bash
pnpm mobile ios
pnpm mobile android
```

[`apps/mobile`](apps/mobile) — Expo. Consumes `@l.x/*` + `@luxfi/wallet`
+ `@zooai/brand` from npm.

## Web build

```bash
pnpm --filter @zooai/exchange-web build
```

Docker: `ghcr.io/hanzoai/spa:1.2.0` serves the tiny Vite bundle; runtime
`/config.json` from K8s ConfigMap drives `defaultChainId`, RPC hosts,
gateway. One image, one bundle, whatever env.

## Contact

X: [@zoocoin](https://x.com/zoocoin) · Discord: [discord.gg/zoo](https://discord.gg/zoo)
· [hi@zoo.ngo](mailto:hi@zoo.ngo)

## License

GPL-3.0-or-later.
