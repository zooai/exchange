import { RegulatedSwapGate } from '@z.o/provider/react'
import { providerClient, providerConfig } from 'src/lib/provider'
import type { Address } from 'viem'

export function RegulatedGate({
  symbol,
  trader,
  onConnect,
  children,
}: {
  symbol: string
  trader: Address | undefined
  onConnect?: () => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <RegulatedSwapGate
      config={providerConfig}
      client={providerClient}
      symbol={symbol}
      trader={trader}
      onConnect={onConnect}
    >
      {children}
    </RegulatedSwapGate>
  )
}
