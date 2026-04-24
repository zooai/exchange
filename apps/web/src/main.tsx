import { createRoot } from 'react-dom/client'
import Exchange, { zooMainnet, zooTestnet } from '@luxfi/exchange'
import brand from '@zooai/brand'

// ─── Features ──────────────────────────────────────────────────────
// Toggle top-level surfaces on/off. Everything else comes from upstream.
Exchange.register({ features: {
  swap:      true,
  pool:      true,
  portfolio: true,
  bridge:    true,
  limit:     true,
  send:      true,
  buy:       true,
  explore:   true,
  activity:  true,
  nft:       false,
}})

// ─── Chains ────────────────────────────────────────────────────────
Exchange.register({ chains: [zooMainnet, zooTestnet] })
Exchange.register({ defaultChain: zooMainnet })

// ─── Featured tokens on the landing page ──────────────────────────
Exchange.register({ featured: [
  { chainId: 200200, address: 'native',          symbol: 'ZOO' },
  { chainId: 200200, address: '0x0bbb4269a4b00e13Ed48e0f3a73a03AF1AeaDC72', symbol: 'WZOO' },
]})

// ─── Login ─────────────────────────────────────────────────────────
// iam.zoo.network is the OIDC issuer; zoolabs.id is the user-facing
// login/KYC/account flow. Runtime /config.json (K8s ConfigMap) wins
// for per-env overrides (testnet/devnet issuers).
Exchange.register({ auth: {
  provider: 'iam',
  issuer:   'https://iam.zoo.network',
  clientId: 'zoo-exchange',
  idHost:   'https://zoolabs.id',
}})

// ─── i18n overrides ───────────────────────────────────────────────
Exchange.register({ i18n: {
  'en-US': {
    'landing.hero.title': 'Trade ZOO and every token on Zoo Network',
    'swap.cta':           'Swap on Zoo',
    'pool.cta':           'Earn with ZOO liquidity',
  },
}})

// ─── Mount ────────────────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
