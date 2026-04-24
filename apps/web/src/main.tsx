// Zoo Exchange — thin shim over @luxfi/exchange.
//
// Customize: `Exchange.registerRoute({ path, component })`
//            `Exchange.registerWidget({ slot, component })`

import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

createRoot(document.getElementById('root')!).render(<Exchange brand={brand} />)
