import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'

// Zoo Exchange — trade ZOO and every token on Zoo Network.
//
// `@zooai/brand` IS the config — spread, override locally where needed.

createRoot(document.getElementById('root')!).render(
  <Exchange
    {...brand}
    features={{ nft: false }}
  />,
)
