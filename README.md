# Zoo Exchange

[**zoo.exchange**](https://zoo.exchange) — trade **ZOO** and every token on
Zoo Network. Fast, native, beautiful.

## The whole thing

```tsx
// apps/web/src/main.tsx
import { createRoot } from 'react-dom/client'
import Exchange from '@zooai/exchange'
import brand from '@zooai/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
```

## Customize

One `register` API. Orthogonal payloads.

```ts
import Exchange from '@zooai/exchange'
import { zooMainnet } from '@zooai/chains'
import ZooStakePage from './ZooStakePage'

Exchange.register({ route:  { path: '/stake', component: ZooStakePage } })
Exchange.register({ widget: { slot: 'swap.footer', component: ZooPromo } })
Exchange.register({ chain:  zooMainnet })
```

The register payload selects the extension point — no second surface.

## Brand

Colors, logo, fonts, chain defaults live in
[`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand) (source:
`~/work/zoo/brand`). Bump the brand package, rebuild the image, done —
zero code changes here.

## Mobile

```bash
pnpm mobile ios
pnpm mobile android
```

[`apps/mobile`](apps/mobile) — Expo build of Zoo Exchange for iOS and
Android.

## Web build

```bash
pnpm --filter @zooai/exchange build
```

Docker serves the bundle from `ghcr.io/hanzoai/spa:1.2.0`; runtime
`/config.json` from the K8s ConfigMap picks chain, RPC, and gateway —
one image, any environment.

## Contact

X: [@zoocoin](https://x.com/zoocoin) · Discord:
[discord.gg/zoo](https://discord.gg/zoo) ·
[hi@zoo.ngo](mailto:hi@zoo.ngo)

## License

GPL-3.0-or-later.
