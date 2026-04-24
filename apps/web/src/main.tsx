// Zoo Exchange — composes the canonical Lux SPA with Zoo's brand.
// One entrypoint. One register() API. One way to do everything.
//
//   import Exchange from '@luxfi/exchange'
//   import brand    from '@zooai/brand'
//
//   Exchange.register({ route:    { path: '/stake', component: ZooStake } })
//   Exchange.register({ widget:   { slot: 'swap.footer', component: ZooPromo } })
//   Exchange.register({ chain:    { id: 200200, ... } })
//   Exchange.register({ provider: { adapter, router, onboardingUrl } })
//
//   <Exchange brand={brand} />

import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
