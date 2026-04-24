# Zoo Exchange

[**zoo.exchange**](https://zoo.exchange) — trade **ZOO** and every token on
Zoo Network. Canonical white-label example for `@luxfi/exchange`.

## The whole app — 80 lines, fully declarative

[`apps/web/src/main.tsx`](apps/web/src/main.tsx) imports the Exchange +
brand + logo + translations, then passes everything as React props:

```tsx
<Exchange
  {...brand}                     // @zooai/brand — visual identity
  logo={Logo}                    // @zooai/logo  — logo marks
  chains={[zooMainnet, …]}       // @luxfi/exchange — canonical chains
  defaultChain={zooMainnet}
  dex={{ kind: 'precompile' }}   // native Lux DEX precompiles
  provider={{ …Liquidity gate… }}
  auth={{ provider: 'iam', issuer: 'https://iam.zoo.network', … }}
  kms={{ url: 'https://kms.zoo.network' }}
  i18n={{ 'en-US': en, 'es-ES': es, 'zh-CN': zh }}
  features={{ nft: false, … }}
  featured={[…]}                 // landing-page token cloud
  routes={[…]}                   // custom pages
  widgets={[…]}                  // custom slot components
/>
```

One component, one prop bag. Order-free, composable, testable.

## Separation of concerns

Each concern lives in exactly one place:

| concern | package / file | what it owns |
| --- | --- | --- |
| **visual identity** | [`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand) | colors, fonts, emails, socials, legal, domains |
| **logo** | [`@zooai/logo`](https://www.npmjs.com/package/@zooai/logo) | SVG marks (mono + color + wordmark) |
| **translations** | `@zooai/brand/translations/<locale>.json` | per-locale text packs |
| **chains** | `@luxfi/exchange` | `zooMainnet`, `zooTestnet`, `luxMainnet`, `luxTestnet`, etc. |
| **Exchange App + SDK** | `@luxfi/exchange` | providers, router, wagmi, swap/pool/portfolio/limit, `@hanzo/gui` bones |
| **DEX backend config** | `main.tsx` `dex` prop | precompile / v3 / gateway / custom adapter |
| **regulated provider** | `main.tsx` `provider` prop | Liquidity SecurityToken gate |
| **auth (IAM)** | `main.tsx` `auth` prop | OIDC issuer + clientId + idHost |
| **KMS** | `main.tsx` `kms` prop | secrets URL (native ZAP client in hanzoai/spa) |
| **features** | `main.tsx` `features` prop | surface toggles |
| **featured tokens** | `main.tsx` `featured` prop or [`featured-tokens.ts`](featured-tokens.ts) | landing-page token cloud |
| **routes** | `main.tsx` `routes` prop | custom pages |
| **widgets** | `main.tsx` `widgets` prop | slot-mounted components |

Brand package changed? Bump `@zooai/brand`, redeploy — zero code here.
Chain changed? Edit the `chains` prop. DEX backend changed? Edit the
`dex` prop. Always in one place. Never duplicated.

## Replace / extend

Anything can be overridden by passing a different prop:

```tsx
// Turn off bridge + limit + nft surfaces
<Exchange {...brand} features={{ bridge: false, limit: false, nft: false }} />

// Swap in a different DEX backend
<Exchange {...brand} dex={{ kind: 'gateway', url: 'https://dex.acme.network' }} />

// Drop the whole landing page, replace with your own component
<Exchange {...brand} widgets={[{ slot: 'landing.hero', component: AcmeHero }]} />

// Add custom routes
<Exchange {...brand} routes={[
  { path: '/stake', component: StakePage },
  { path: '/earn',  component: EarnPage },
]} />
```

## Mobile

[`apps/mobile/`](apps/mobile) — Expo build consumes the same `@luxfi/*`,
`@zooai/brand`, `@zooai/logo` packages directly from npm.

```bash
pnpm --dir apps/mobile ios
pnpm --dir apps/mobile android
```

## Tamagui bones

The SPA is built on [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui)
(Hanzo's Tamagui fork) under the hood — zero configuration required.
Theme tokens from your brand's `theme` field are injected as CSS custom
properties at runtime, so the visual system reflects the brand instantly
without rebuilding.

## Deploy

- **Image:** `ghcr.io/zooai/exchange:<semver>` — built via Dockerfile
  in this repo (multi-stage: Vite build → `ghcr.io/hanzoai/spa:1.2.0`)
- **Runtime:** `/config.json` mounted via K8s ConfigMap, templated from
  `SPA_*` env vars by hanzoai/spa at pod startup
- **Secrets:** Zoo KMS (`kms.zoo.network`) via native ZAP client

## Contact

- X: [@zoo_labs](https://x.com/zoo_labs)
- Discord: [discord.gg/edmZPTZjH9](https://discord.gg/edmZPTZjH9)
- Email: [hi@zoo.exchange](mailto:hi@zoo.exchange)

## License

GPL-3.0-or-later.
