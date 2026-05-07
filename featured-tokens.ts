// Zoo Exchange featured token list — landing page token cloud.
//
// Overlaid onto upstream at build time via Dockerfile:
//   COPY featured-tokens.ts apps/web/src/pages/Landing/assets/approvedTokens.ts
//
// Composition (50 / 25 / 25) across 28 tokens:
//   14 native Zoo-chain assets (≥50%) — ZOO and bridged assets on chain 200200
//    7 public stocks (~25%) — provider-gated SecurityTokens
//    7 private secondaries (~25%) — provider-gated; display-only until deployed
//
// Trading for stocks + private secondaries routes through the configured
// regulated provider (KYC + accreditation enforced). Native Zoo assets trade
// freely on the Zoo DEX.
//
// IMPORTANT: do NOT import from `@l.x/api` here. Its npm publish ships
// unresolved __generated__/* files which break the TokenCloud chunk's
// dynamic import at runtime. Use plain string literals for `chain`.

import ethereumLogo from '~/assets/images/ethereum-logo.png'
import luxLogo from '~/assets/svg/lux_logo.svg'
import zooLogo from '~/assets/svg/zoo_logo.svg'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'

export interface InteractiveToken {
  name: string
  symbol: string
  address: string
  // `chain` is a string at runtime (GraphQL enum value). Inlining the string
  // avoids the @l.x/api import that breaks the TokenCloud chunk.
  chain: any
  color: string
  logoUrl: string
}

// ─── 14 native Zoo-chain assets (≥50%) ────────────────────────────────
const NATIVE: InteractiveToken[] = [
  { name: 'Zoo',         symbol: 'ZOO',  address: NATIVE_CHAIN_ID,                              chain: 'Zoo' as any, color: '#000000', logoUrl: zooLogo },
  { name: 'Wrapped ZOO', symbol: 'WZOO', address: '0x0bbb4269a4b00e13Ed48e0f3a73a03AF1AeaDC72', chain: 'Zoo' as any, color: '#000000', logoUrl: zooLogo },
  // Canonical Zoo Bridge tokens — Z-prefix = on-Zoo-chain version.
  { name: 'Zoo BTC',     symbol: 'ZBTC', address: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e', chain: 'Zoo' as any, color: '#F7931A', logoUrl: 'https://cdn.lux.network/bridge/currencies/zoo/zbtc.svg' },
  { name: 'Zoo ETH',     symbol: 'ZETH', address: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba', chain: 'Zoo' as any, color: '#627EEA', logoUrl: 'https://cdn.lux.network/bridge/currencies/zoo/zeth.svg' },
  { name: 'Zoo Dollar',  symbol: 'ZUSD', address: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2', chain: 'Zoo' as any, color: '#26A17B', logoUrl: 'https://cdn.lux.network/bridge/currencies/zoo/zusd.svg' },
  { name: 'Zoo LUX',     symbol: 'ZLUX', address: '0x5E5290f350352768bD2bfC59c2DA15DD04A7cB88', chain: 'Zoo' as any, color: '#FFFFFF', logoUrl: 'https://cdn.lux.network/bridge/currencies/zoo/zlux.svg' },
  { name: 'USD Coin',    symbol: 'USDC', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#2775CA', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
  { name: 'Tether USD',  symbol: 'USDT', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#26A17B', logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { name: 'Dai',         symbol: 'DAI',  address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#F5AC37', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png' },
  { name: 'Avalanche',   symbol: 'AVAX', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#E84142', logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  { name: 'Chainlink',   symbol: 'LINK', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#2A5ADA', logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
  { name: 'Pepe',        symbol: 'PEPE', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#479F53', logoUrl: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
  { name: 'Shiba Inu',   symbol: 'SHIB', address: '0x0000000000000000000000000000000000000000', chain: 'Zoo' as any, color: '#FFA409', logoUrl: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  { name: 'Ethereum',    symbol: 'ETH',  address: NATIVE_CHAIN_ID,                              chain: 'Ethereum' as any, color: '#627EEA', logoUrl: ethereumLogo },
]

// ─── 7 public stocks (~25%) — provider-gated SecurityTokens ─────────────
const STOCKS: InteractiveToken[] = [
  { name: 'Apple Inc',     symbol: 'AAPL',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#000000', logoUrl: 'https://logo.clearbit.com/apple.com' },
  { name: 'Microsoft Corp',symbol: 'MSFT',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#00A4EF', logoUrl: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'NVIDIA Corp',   symbol: 'NVDA',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#76B900', logoUrl: 'https://logo.clearbit.com/nvidia.com' },
  { name: 'Tesla Inc',     symbol: 'TSLA',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#CC0000', logoUrl: 'https://logo.clearbit.com/tesla.com' },
  { name: 'Alphabet Inc',  symbol: 'GOOGL', address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/google.com' },
  { name: 'Amazon.com Inc',symbol: 'AMZN',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#FF9900', logoUrl: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Meta Platforms',symbol: 'META',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#1877F2', logoUrl: 'https://logo.clearbit.com/meta.com' },
]

// ─── 7 private secondaries (~25%) — display-only until deployed ───────
const PRIVATE: InteractiveToken[] = [
  { name: 'OpenAI',     symbol: 'OPENAI',     address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#10A37F', logoUrl: 'https://logo.clearbit.com/openai.com' },
  { name: 'SpaceX',     symbol: 'SPACEX',     address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#000000', logoUrl: 'https://logo.clearbit.com/spacex.com' },
  { name: 'Anthropic',  symbol: 'ANTHROPIC',  address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#D97757', logoUrl: 'https://logo.clearbit.com/anthropic.com' },
  { name: 'Stripe',     symbol: 'STRIPE',     address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#635BFF', logoUrl: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Databricks', symbol: 'DATABRICKS', address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#FF3621', logoUrl: 'https://logo.clearbit.com/databricks.com' },
  { name: 'xAI',        symbol: 'XAI',        address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#000000', logoUrl: 'https://logo.clearbit.com/x.ai' },
  { name: 'Revolut',    symbol: 'REVOLUT',    address: '0x0000000000000000000000000000000000000000', chain: 'Ethereum' as any, color: '#0075EB', logoUrl: 'https://logo.clearbit.com/revolut.com' },
]

// Final list: 14 + 7 + 7 = 28 tokens. ~50% native Zoo, ~25% stocks, ~25% private.
export const approvedERC20: InteractiveToken[] = [...NATIVE, ...STOCKS, ...PRIVATE]
