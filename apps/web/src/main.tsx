// Zoo Exchange — trade ZOO and every token on Zoo Network.
//
// Everything declarative. Separation of concerns. One way, one place.
//
// ─── Imports ────────────────────────────────────────────────────────
//   @luxfi/exchange   → the Exchange App + canonical chains + SDK
//   @zooai/brand      → visual identity ONLY (logo, colors, fonts,
//                        socials, legal, domains). No chain / auth / kms.
//   @zooai/logo       → logo marks as React components (monochrome +
//                        color variants). Separate package for clarity.
//   @zooai/brand/translations/*.json → locale packs

import { createRoot } from 'react-dom/client'
import Exchange, {
  zooMainnet,
  zooTestnet,
  luxMainnet,
  luxTestnet,
} from '@luxfi/exchange'
import brand from '@zooai/brand'
import Logo from '@zooai/logo'
import en from '@zooai/brand/translations/en-US.json'
import es from '@zooai/brand/translations/es-ES.json'
import zh from '@zooai/brand/translations/zh-CN.json'

// ─── Exchange config ────────────────────────────────────────────────
// Everything exchange-specific (chains, DEX, provider gate, auth,
// features, content, routes, widgets) is declared here — NOT in the
// brand package. Replace / override / delete any section freely.

createRoot(document.getElementById('root')!).render(
  <Exchange
    // Visual identity from @zooai/brand (pure: logos, colors, fonts, socials)
    {...brand}
    logo={Logo}

    // Supported chains — Zoo Network primary, Lux secondary (bridged assets)
    chains={[zooMainnet, zooTestnet, luxMainnet, luxTestnet]}
    defaultChain={zooMainnet}

    // DEX backend — native Lux DEX precompiles (LP-9010 family) on Zoo Network
    dex={{ kind: 'precompile' }}

    // Regulated-asset gate — securities (AAPL / private stocks) route through
    // the Liquidity/Alpaca compliance provider. Retail crypto bypasses.
    provider={{
      name:          'Liquidity',
      adapter:       '0x0000000000000000000000000000000000000000', // TODO: deployed adapter addr
      router:        '0x0000000000000000000000000000000000000000', // TODO: ProviderRouter addr
      onboardingUrl: 'https://zoolabs.id/onboarding',
    }}

    // Login — Zoo's white-label Hanzo IAM, user-facing at zoolabs.id
    auth={{
      provider: 'iam',
      issuer:   'https://iam.zoo.network',
      clientId: 'zoo-exchange',
      idHost:   'https://zoolabs.id',
    }}

    // KMS — secrets + runtime config come from Zoo's KMS white-label
    kms={{ url: 'https://kms.zoo.network' }}

    // Translations — edit JSON in @zooai/brand/translations, redeploy
    i18n={{ 'en-US': en, 'es-ES': es, 'zh-CN': zh }}

    // Feature flags — turn surfaces on/off. NFT off for now.
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
      nft:       false,
    }}

    // Featured tokens on the landing page — 14 native Zoo, 7 stocks,
    // 7 private securities (50/25/25). Full list in featured-tokens.ts
    // (used by the Docker overlay path; inline array works too).
    // featured={[
    //   { chainId: 200200, address: 'native', symbol: 'ZOO' },
    //   { chainId: 200200, address: '0x0bbb...', symbol: 'WZOO' },
    //   // ...
    // ]}

    // Custom routes — add Zoo-specific pages without touching upstream.
    // routes={[{ path: '/stake', component: ZooStakePage }]}

    // Custom widgets — mount components into named slots (landing.hero,
    // swap.footer, portfolio.aside, etc.).
    // widgets={[{ slot: 'landing.hero', component: ZooHero }]}
  />,
)
