// Zoo Exchange — trade ZOO and every token on Zoo Network.
// Declarative config. Separation of concerns. One way, one place.

import { createRoot } from 'react-dom/client'
import Exchange, { canonicalChains, zooMainnet } from '@luxfi/exchange'
import brand from '@zooai/brand'
import Logo  from '@zooai/logo'
import en from '@zooai/brand/translations/en-US.json'
import es from '@zooai/brand/translations/es-ES.json'
import zh from '@zooai/brand/translations/zh-CN.json'

createRoot(document.getElementById('root')!).render(
  <Exchange
    // ─── Visual identity ────────────────────────────────────────────
    // @zooai/brand is pure brand (logo refs, colors, fonts, socials,
    // emails, legal, domains). @zooai/logo ships the SVG marks.
    {...brand}
    logo={Logo}

    // ─── Chains ──────────────────────────────────────────────────────
    // canonicalChains = lux + hanzo + zoo + pars + liquid (all 3 envs each).
    // Primary is Zoo. Bridging + cross-chain swaps work to/from any chain
    // in the set. Add custom chains by spreading: [...canonicalChains, foo].
    chains={canonicalChains}
    defaultChain={zooMainnet}

    // ─── DEX backend ─────────────────────────────────────────────────
    // Native Lux DEX precompiles on Zoo chain — sub-microsecond matching.
    // Falls back to V2 AMM (zoo mainnet factory+router deployed 2026-03-04)
    // for chains without precompiles.
    dex={{ kind: 'precompile' }}

    // ─── Regulated-asset gate (Liquidity/Alpaca) ────────────────────
    // Public stocks (AAPL) + private securities (OpenAI, Anthropic, etc.)
    // gate through the Liquidity provider — KYC/accreditation enforced.
    provider={{
      name:          'Liquidity',
      adapter:       '0x0000000000000000000000000000000000000000', // TODO: deployed IRegulatedProvider
      router:        '0x0000000000000000000000000000000000000000', // TODO: Lux ProviderRouter
      onboardingUrl: 'https://zoolabs.id/onboarding',
    }}

    // ─── Auth (Hanzo IAM white-label) ───────────────────────────────
    auth={{
      provider: 'iam',
      issuer:   'https://iam.zoo.network',
      clientId: 'zoo-exchange',
      idHost:   'https://zoolabs.id',
    }}

    // ─── KMS (secrets + runtime config) ─────────────────────────────
    kms={{ url: 'https://kms.zoo.network' }}

    // ─── Translations ────────────────────────────────────────────────
    // JSON ships in @zooai/brand/translations. Edit, bump, redeploy.
    i18n={{ 'en-US': en, 'es-ES': es, 'zh-CN': zh }}

    // ─── Feature toggles ─────────────────────────────────────────────
    features={{
      swap:      true,
      pool:      true,
      portfolio: true,
      limit:     true,
      send:      true,
      buy:       true,
      bridge:    true,
      explore:   true,
      activity:  true,
      nft:       true,  // Zoo ships an NFT surface
    }}

    // ─── Featured tokens on the landing page ────────────────────────
    // 50% public stocks (Alpaca-gated) / 25% private securities /
    // 25% native Zoo-chain assets. Full 28-token list in
    // featured-tokens.ts (used by Docker overlay path).
    featured={[
      // Stocks (50%) — gated via Liquidity provider
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'AAPL', name: 'Apple Inc', color: '#000000' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'MSFT', name: 'Microsoft', color: '#00A4EF' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'NVDA', name: 'NVIDIA',    color: '#76B900' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'TSLA', name: 'Tesla',     color: '#CC0000' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'GOOGL',name: 'Alphabet',  color: '#4285F4' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'AMZN', name: 'Amazon',    color: '#FF9900' },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'META', name: 'Meta',      color: '#1877F2' },
      // Private (25%) — gated via Liquidity provider
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'OPENAI',     name: 'OpenAI',     color: '#10A37F', regulated: true },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'ANTHROPIC',  name: 'Anthropic',  color: '#D97757', regulated: true },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'SPACEX',     name: 'SpaceX',     color: '#000000', regulated: true },
      { chainId: 8675309, address: '0x0000000000000000000000000000000000000000', symbol: 'STRIPE',     name: 'Stripe',     color: '#635BFF', regulated: true },
      // Native Zoo (25%) — Zoo mainnet (200200), addresses from 2026-03-04 deploy
      { chainId: 200200, address: 'native',                                      symbol: 'ZOO',  name: 'Zoo',   color: '#000000' },
      { chainId: 200200, address: '0x5491216406daB99b7032b83765F36790E27F8A61', symbol: 'WLUX', name: 'Wrapped Lux', color: '#FFFFFF' },
      { chainId: 200200, address: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2', symbol: 'LETH', name: 'Lux ETH',     color: '#627EEA' },
      { chainId: 200200, address: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8', symbol: 'LBTC', name: 'Lux BTC',     color: '#F7931A' },
      { chainId: 200200, address: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D', symbol: 'LUSD', name: 'Lux USD',     color: '#26A17B' },
    ]}

    // ─── Custom routes / widgets (slots: landing.hero, swap.footer, …) ──
    // routes={[{ path: '/stake', component: ZooStakePage }]}
    // widgets={[{ slot: 'landing.hero', component: ZooHero }]}
  />,
)
