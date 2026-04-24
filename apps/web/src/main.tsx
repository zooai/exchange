// Zoo Exchange — trade ZOO and every token on Zoo Network.
// Declarative config. Separation of concerns. One way, one place.
//
// Copyright (c) 2025-2026 Zoo Labs Foundation Inc. — BSD-3-Clause.

import { createRoot } from 'react-dom/client'
import Exchange, { canonicalChains, zooMainnet } from '@luxfi/exchange'
import brand from '@zooai/brand'
import Logo  from '@zooai/logo'
import en from '@zooai/brand/translations/en-US.json'
import es from '@zooai/brand/translations/es-ES.json'
import zh from '@zooai/brand/translations/zh-CN.json'

// Canonical chain IDs used by the provider endpoint map below.
const LIQUID_MAINNET = 8675309
const LIQUID_TESTNET = 8675310
const LIQUID_DEVNET  = 8675311

createRoot(document.getElementById('root')!).render(
  <Exchange
    // ─── Visual identity ────────────────────────────────────────────
    // @zooai/brand is pure brand (logo refs, colors, fonts, socials,
    // emails, legal, domains). @zooai/logo ships the SVG marks.
    {...brand}
    logo={Logo}

    // ─── Chains ──────────────────────────────────────────────────────
    // canonicalChains = lux + hanzo + zoo + liquid (all 3 envs each) = 12.
    // Primary is Zoo Mainnet. Bridging + cross-chain swaps work to/from
    // any chain in the set via ~/work/lux/bridge (Warp + MPC threshold).
    // Extend with: chains={[...canonicalChains, foo]}.
    chains={canonicalChains}
    defaultChain={zooMainnet}

    // ─── DEX backend (layered — precompile → V3 → V2 → gateway) ─────
    // `gateway` mode hits dex.lux.network which internally layers all
    // available backends on the target chain (precompile first, then V3
    // factory+router, then V2 factory+router, then Warp cross-chain
    // routing). Single declarative switch — per-chain backends live in
    // @luxfi/exchange/src/contracts/addresses.ts and are selected by
    // the router based on active chain id.
    dex={{ kind: 'gateway', url: 'https://dex.lux.network' }}

    // ─── Regulated-asset gate (Liquidity) ───────────────────────────
    // Stocks + private securities are BOTH regulated. Every trade
    // routes through the Liquidity provider on Liquid EVM — KYC +
    // accreditation enforced. Each Liquid env has its own adapter +
    // onboarding host (dev/test/prod are separate ATS deployments).
    provider={{
      name: 'Liquidity',
      endpoints: {
        [LIQUID_MAINNET]: {
          adapter:       '0x0000000000000000000000000000000000000000', // TODO: prod IRegulatedProvider
          router:        '0x0000000000000000000000000000000000000000', // TODO: Lux ProviderRouter (prod)
          onboardingUrl: 'https://id.satschel.com/onboarding',
        },
        [LIQUID_TESTNET]: {
          adapter:       '0x0000000000000000000000000000000000000000', // TODO: testnet IRegulatedProvider
          router:        '0x0000000000000000000000000000000000000000', // TODO: Lux ProviderRouter (testnet)
          onboardingUrl: 'https://id.test.satschel.com/onboarding',
        },
        [LIQUID_DEVNET]: {
          adapter:       '0x0000000000000000000000000000000000000000', // TODO: devnet IRegulatedProvider
          router:        '0x0000000000000000000000000000000000000000', // TODO: Lux ProviderRouter (devnet)
          onboardingUrl: 'https://id.dev.satschel.com/onboarding',
        },
      },
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
    // 50% public stocks / 25% private securities / 25% native Zoo.
    // Stocks + private are BOTH regulated — every trade gates through
    // the Liquidity provider. Zoo native tokens are the Z-prefix Bridge
    // assets from ~/work/lux/bridge (canonical, deterministic across
    // mainnet/testnet/devnet). Full 28-token list in featured-tokens.ts.
    featured={[
      // Stocks (50%) — regulated, Liquidity-gated (Liquid EVM Mainnet)
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'AAPL',  name: 'Apple Inc',  color: '#000000', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'MSFT',  name: 'Microsoft',  color: '#00A4EF', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'NVDA',  name: 'NVIDIA',     color: '#76B900', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'TSLA',  name: 'Tesla',      color: '#CC0000', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'GOOGL', name: 'Alphabet',   color: '#4285F4', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'AMZN',  name: 'Amazon',     color: '#FF9900', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'META',  name: 'Meta',       color: '#1877F2', regulated: true },
      // Private (25%) — regulated, Liquidity-gated
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'OPENAI',    name: 'OpenAI',    color: '#10A37F', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'ANTHROPIC', name: 'Anthropic', color: '#D97757', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'SPACEX',    name: 'SpaceX',    color: '#000000', regulated: true },
      { chainId: LIQUID_MAINNET, address: '0x0000000000000000000000000000000000000000', symbol: 'STRIPE',    name: 'Stripe',    color: '#635BFF', regulated: true },
      // Native Zoo (25%) — canonical Zoo Bridge tokens on Zoo Mainnet.
      // Source of truth: ~/work/lux/bridge (Teleport wrapped-asset registry).
      { chainId: 200200, address: 'native',                                      symbol: 'ZOO',  name: 'Zoo',        color: '#000000' },
      { chainId: 200200, address: '0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88', symbol: 'ZLUX', name: 'Zoo LUX',    color: '#FFFFFF' },
      { chainId: 200200, address: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba', symbol: 'ZETH', name: 'Zoo ETH',    color: '#627EEA' },
      { chainId: 200200, address: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e', symbol: 'ZBTC', name: 'Zoo BTC',    color: '#F7931A' },
      { chainId: 200200, address: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2', symbol: 'ZUSD', name: 'Zoo Dollar', color: '#26A17B' },
    ]}

    // ─── Custom routes / widgets (slots: landing.hero, swap.footer, …) ──
    // routes={[{ path: '/stake', component: ZooStakePage }]}
    // widgets={[{ slot: 'landing.hero', component: ZooHero }]}
  />,
)
