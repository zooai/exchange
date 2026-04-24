import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

// Zoo Exchange — trade ZOO + any token on Zoo Network.
//
// Extend via one API:
//   Exchange.register({ route:    { path: '/stake', component: ZooStakePage } })
//   Exchange.register({ widget:   { slot: 'swap.footer', component: ZooPromo } })
//   Exchange.register({ chain:    zooMainnet })
//   Exchange.register({ provider: { adapter, router, onboardingUrl } })

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
