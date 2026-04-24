// Zoo Exchange — 12-line shim over @luxfi/exchange.
//
// Everything lives upstream: providers, router, swap/pool/portfolio, wagmi,
// Tamagui/@hanzo/gui bones, Insights telemetry, etc. This file only
// composes the canonical `ExchangeWebApp` with Zoo's brand + any
// zoo-specific route/widget overrides.
//
// Customize: `registerRoute({ path: '/zoo-stake', component: ZooStakePage })`
//            `registerWidget({ slot: 'swap.footer', component: ZooPromo })`
// See @luxfi/exchange/web README for the full slot/route catalog.

import { createRoot } from 'react-dom/client'
import { ExchangeWebApp } from '@luxfi/exchange/web'
import brand from '@zooai/brand'

const root = document.getElementById('root')
if (!root) throw new Error('Zoo Exchange: <div id="root"> missing from index.html')

createRoot(root).render(<ExchangeWebApp brand={brand} />)
