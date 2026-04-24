// Zoo Exchange featured token list — landing page token cloud.
//
// Overlaid onto upstream at build time via Dockerfile:
//   COPY featured-tokens.ts apps/web/src/pages/Landing/assets/approvedTokens.ts
//
// Composition (50 / 25 / 25) across 28 tokens:
//   14 native Zoo-chain assets (≥50%) — ZOO and bridged assets on chain 200200
//    7 public stocks (~25%) — AAPL + 6 more via Alpaca-gated SecurityTokens
//    7 private securities (~25%) — OpenAI/SpaceX/Anthropic/etc. (display-only
//                                   until deployed on Zoo EVM)
//
// Trading for stocks + private securities routes through the regulated
// provider gate (KYC-gated). Native Zoo assets trade freely on the Zoo DEX.

import { GraphQLApi } from '@l.x/api'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'

export interface InteractiveToken {
  name: string
  symbol: string
  address: string
  chain: GraphQLApi.Chain
  color: string
  logoUrl: string
}

// Zoo EVM — chainId 200200 (mainnet) / 200201 (testnet).
// Upstream GraphQL schema doesn't yet have a Zoo enum; TokenCloud degrades
// gracefully via useTokenPromoQuery. Trading routes through the gateway.
const ZOO_EVM = GraphQLApi.Chain.UnknownChain

// ─── 14 native Zoo-chain assets (≥50%) ────────────────────────────────
const NATIVE: InteractiveToken[] = [
  {
    name: 'Zoo',
    symbol: 'ZOO',
    address: NATIVE_CHAIN_ID,
    chain: ZOO_EVM,
    color: '#000000',
    logoUrl: 'https://cdn.jsdelivr.net/npm/@zooai/brand@latest/assets/logo/logo.svg',
  },
  {
    name: 'Wrapped ZOO',
    symbol: 'WZOO',
    address: '0x0bbb4269a4b00e13Ed48e0f3a73a03AF1AeaDC72',
    chain: ZOO_EVM,
    color: '#000000',
    logoUrl: 'https://cdn.jsdelivr.net/npm/@zooai/brand@latest/assets/logo/logo.svg',
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#F7931A',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  {
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#627EEA',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    name: 'Wrapped Lux',
    symbol: 'WLUX',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#FFFFFF',
    logoUrl: 'https://cdn.jsdelivr.net/gh/luxfi/brand@main/assets/logo.svg',
  },
  {
    name: 'Wrapped Solana',
    symbol: 'WSOL',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#9945FF',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#2775CA',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#26A17B',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#F5AC37',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#E84142',
    logoUrl: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  },
  {
    name: 'Chainlink',
    symbol: 'LINK',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#2A5ADA',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#FF007A',
    logoUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  },
  {
    name: 'Pepe',
    symbol: 'PEPE',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#479F53',
    logoUrl: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  },
  {
    name: 'Shiba Inu',
    symbol: 'SHIB',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#FFA409',
    logoUrl: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  },
]

// ─── 7 public stocks (~25%) — Alpaca-gated SecurityTokens ─────────────
const STOCKS: InteractiveToken[] = [
  {
    name: 'Apple Inc',
    symbol: 'AAPL',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#000000',
    logoUrl: 'https://logo.clearbit.com/apple.com',
  },
  {
    name: 'Microsoft Corp',
    symbol: 'MSFT',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#00A4EF',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
  },
  {
    name: 'NVIDIA Corp',
    symbol: 'NVDA',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#76B900',
    logoUrl: 'https://logo.clearbit.com/nvidia.com',
  },
  {
    name: 'Tesla Inc',
    symbol: 'TSLA',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#CC0000',
    logoUrl: 'https://logo.clearbit.com/tesla.com',
  },
  {
    name: 'Alphabet Inc',
    symbol: 'GOOGL',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#4285F4',
    logoUrl: 'https://logo.clearbit.com/google.com',
  },
  {
    name: 'Amazon.com Inc',
    symbol: 'AMZN',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#FF9900',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
  },
  {
    name: 'Meta Platforms',
    symbol: 'META',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#1877F2',
    logoUrl: 'https://logo.clearbit.com/meta.com',
  },
]

// ─── 7 private securities (~25%) — display-only until deployed ───────
const PRIVATE: InteractiveToken[] = [
  {
    name: 'OpenAI',
    symbol: 'OPENAI',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#10A37F',
    logoUrl: 'https://logo.clearbit.com/openai.com',
  },
  {
    name: 'SpaceX',
    symbol: 'SPACEX',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#000000',
    logoUrl: 'https://logo.clearbit.com/spacex.com',
  },
  {
    name: 'Anthropic',
    symbol: 'ANTHROPIC',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#D97757',
    logoUrl: 'https://logo.clearbit.com/anthropic.com',
  },
  {
    name: 'Stripe',
    symbol: 'STRIPE',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#635BFF',
    logoUrl: 'https://logo.clearbit.com/stripe.com',
  },
  {
    name: 'Databricks',
    symbol: 'DATABRICKS',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#FF3621',
    logoUrl: 'https://logo.clearbit.com/databricks.com',
  },
  {
    name: 'xAI',
    symbol: 'XAI',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#000000',
    logoUrl: 'https://logo.clearbit.com/x.ai',
  },
  {
    name: 'Revolut',
    symbol: 'REVOLUT',
    address: '0x0000000000000000000000000000000000000000',
    chain: ZOO_EVM,
    color: '#0075EB',
    logoUrl: 'https://logo.clearbit.com/revolut.com',
  },
]

// Final list: 14 + 7 + 7 = 28 tokens. 50% native Zoo, 25% stocks, 25% private.
export const approvedERC20: InteractiveToken[] = [...NATIVE, ...STOCKS, ...PRIVATE]
