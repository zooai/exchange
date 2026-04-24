import type { Address } from 'viem'

/** Provider configuration. Mirrors lux/exchange's @l.x/provider/config. */
export interface ProviderConfig {
  adapter: Address | null
  router: Address | null
  name: string | null
  onboardingUrl: string | null
}

export const NULL_PROVIDER: ProviderConfig = {
  adapter: null,
  router: null,
  name: null,
  onboardingUrl: null,
}

/**
 * Env key convention (Vite-native):
 *   VITE_LIQUIDITY_ADAPTER
 *   VITE_LIQUIDITY_ROUTER
 *   VITE_LIQUIDITY_NAME
 *   VITE_LIQUIDITY_ONBOARDING_URL
 *
 * Pass `import.meta.env`. Missing keys → null fields → pass-through gate.
 */
export function readProviderConfig(env: Record<string, string | undefined>): ProviderConfig {
  const adapter = (env.VITE_LIQUIDITY_ADAPTER || '') as Address
  const router  = (env.VITE_LIQUIDITY_ROUTER  || '') as Address
  return {
    adapter: adapter.length ? adapter : null,
    router:  router.length  ? router  : null,
    name:          env.VITE_LIQUIDITY_NAME          ?? null,
    onboardingUrl: env.VITE_LIQUIDITY_ONBOARDING_URL ?? null,
  }
}

export function buildOnboardingUrl(cfg: ProviderConfig, returnUrl: string, traderAddress?: string): string | null {
  if (!cfg.onboardingUrl) return null
  const url = new URL(cfg.onboardingUrl)
  url.searchParams.set('return', returnUrl)
  if (traderAddress) url.searchParams.set('address', traderAddress)
  return url.toString()
}
