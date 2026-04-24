import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'
import brand from '@zooai/brand'
import en from '@zooai/brand/translations/en-US.json'
import es from '@zooai/brand/translations/es-ES.json'
import zh from '@zooai/brand/translations/zh-CN.json'

// Zoo Exchange — trade ZOO and every token on Zoo Network.
//
// Everything lives in @zooai/brand (content, logo, chain defaults, auth,
// kms, fonts, colors). Translations ship alongside. Spread, override
// anything local.

createRoot(document.getElementById('root')!).render(
  <Exchange
    {...brand}
    i18n={{ 'en-US': en, 'es-ES': es, 'zh-CN': zh }}
    features={{ nft: false }}
  />,
)
