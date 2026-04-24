# Zoo Exchange

[zoo.exchange](https://zoo.exchange) — the decentralized exchange for the
Zoo ecosystem. Native trading on Zoo Network (chain ID 200200).

## Apps

- `apps/web` — Vite SPA at [zoo.exchange](https://zoo.exchange)
- `apps/mobile` — iOS + Android (Expo)

The browser-extension wallet lives upstream at
[luxfi/wallet](https://github.com/luxfi/wallet). `@luxfi/wallet` on npm
is the shared library; no extension is maintained here.

## Install & run

```bash
git clone git@github.com:zooai/exchange.git
cd exchange
pnpm install
pnpm web dev
```

Per-app instructions: [`apps/web/README.md`](apps/web/README.md),
[`apps/mobile/README.md`](apps/mobile/README.md).

## Packages

Everything shared comes from npm — one canonical home at
[luxfi/exchange](https://github.com/luxfi/exchange):

| scope | examples |
| --- | --- |
| `@l.x/*` | `@l.x/lx`, `@l.x/ui`, `@l.x/utils`, `@l.x/api`, `@l.x/config`, `@l.x/gating`, `@l.x/prices`, `@l.x/sessions`, `@l.x/notifications`, `@l.x/websocket`, `@l.x/jest-preset`, `@l.x/tsconfig`, `@l.x/vitest-preset` |
| `@luxfi/*` | `@luxfi/exchange`, `@luxfi/dex`, `@luxfi/wallet`, `@luxfi/biome-config`, `@luxfi/eslint-config` |
| `@zooai/*` | `@zooai/brand` (logo, colors, fonts, `brand.json`) |

Only zoo-specific code lives here — right now that's
[`pkgs/provider`](pkgs/provider) (`@l.x/provider` regulated-swap gate).

## Chain

Zoo Network (chain ID `200200`) — set via the `defaultChainId` field in
`/config.json` (K8s ConfigMap), loaded at runtime by `@l.x/config`.

## Directory

| folder | contents |
| --- | --- |
| `apps/` | standalone apps (web, mobile) |
| `pkgs/` | zoo-specific packages (currently only `provider`) |
| `deploy/` | K8s manifest + ConfigMap for prod `zoo.exchange` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Contact

- X: [@zoocoin](https://x.com/zoocoin)
- Discord: [discord.gg/zoo](https://discord.gg/zoo)
- Email: [hi@zoo.ngo](mailto:hi@zoo.ngo)

## License

GPL-3.0-or-later — see [LICENSE](LICENSE).
