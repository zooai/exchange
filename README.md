# Zoo Exchange

[zoo.exchange](https://zoo.exchange) — white-label Zoo Network deployment
of the **Lux Exchange** SPA. Two surfaces:

- **Web** — Docker overlay of [`ghcr.io/luxfi/exchange`](https://github.com/luxfi/exchange)
  + [`@zooai/brand`](https://www.npmjs.com/package/@zooai/brand) from npm.
  Zero source code here. `Dockerfile` is ~15 lines.
- **Mobile** — Expo app in [`apps/mobile`](apps/mobile), consumes
  `@l.x/*` + `@luxfi/wallet` + `@zooai/brand` from npm.

## Architecture

```
ghcr.io/luxfi/exchange:latest         ←  canonical SPA (hanzoai/spa + @hanzogui bones)
           │
           └── FROM  (Dockerfile)
                │
                └── COPY /brand from @zooai/brand  ←  Zoo identity
                       │
                       └── K8s ConfigMap mounts /config.json  ←  chainId 200200, RPC, IAM
```

**Canonical source for the SPA is upstream** at
`~/work/lux/exchange` → `ghcr.io/luxfi/exchange`. This repo holds only
what's Zoo-specific:
- `Dockerfile` — the overlay recipe
- `apps/mobile/` — the Zoo Expo app

Nothing else. No `src/`, no `pkgs/`, no `contracts/`, no `subgraphs/`,
no `deploy/`, no vendored configs. If you need to change the web SPA,
send a PR to [luxfi/exchange](https://github.com/luxfi/exchange). If you
need to change the Zoo brand, edit [`~/work/zoo/brand`](https://www.npmjs.com/package/@zooai/brand)
and republish.

## Customize

**Add Zoo-specific pages or widgets:** PR upstream to `luxfi/exchange` to
add your route/widget behind a feature flag. Toggle the flag via
`/config.json` ConfigMap for `zoo.exchange` only.

**Different chain / tokens:** `/config.json` defaults (K8s ConfigMap at
deploy time). `defaultChainId` + `supportedChainIds` + RPC hosts.

**Different brand:** `@zooai/brand` is a standalone npm package —
colors, logos, fonts, `brand.json`. Publishing a new version + tagging
the Dockerfile rebuilds with the new brand.

## Mobile

```bash
pnpm install
pnpm mobile ios      # iOS simulator
pnpm mobile android  # Android emulator
pnpm mobile start    # Metro bundler
```

Mobile consumes `@l.x/api`, `@l.x/lx`, `@l.x/ui`, `@l.x/utils`,
`@luxfi/wallet`, `@zooai/brand` directly from npm.

## Deploy

Web: CI builds `ghcr.io/zooai/exchange:v*` and pushes to GHCR. Universe
dispatch updates the K8s ConfigMap + rolls the deployment.

Mobile: EAS build → TestFlight / Play Store via `pnpm mobile build`.

## Contact

- X: [@zoocoin](https://x.com/zoocoin)
- Discord: [discord.gg/zoo](https://discord.gg/zoo)
- Email: [hi@zoo.ngo](mailto:hi@zoo.ngo)

## License

GPL-3.0-or-later — see [LICENSE](LICENSE).
