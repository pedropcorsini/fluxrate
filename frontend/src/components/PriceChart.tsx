import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Quote } from '../lib/types'

interface PriceChartProps {
  quotes: Quote[]
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Compact axis formatter whose decimal precision adapts to how tight the
 * data range is. A fixed precision like "330k" collapses close values
 * (329674 and 330070 would both round to the same label).
 */
function makeCompactFormatter(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  return (value: number) => {
    const abs = Math.abs(value)
    if (abs < 1_000) return value.toFixed(2)

    const divisor = abs >= 1_000_000 ? 1_000_000 : 1_000
    const suffix = abs >= 1_000_000 ? 'M' : 'k'

    // Enough decimals so that two ticks separated by the data range stay distinguishable.
    const relativeStep = range > 0 ? range / divisor : 0
    const decimals = relativeStep > 0 ? Math.min(2, Math.max(0, Math.ceil(-Math.log10(relativeStep)))) : 1

    return `${(value / divisor).toFixed(decimals)}${suffix}`
  }
}

export function PriceChart({ quotes }: PriceChartProps) {
  const data = [...quotes]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((quote) => ({ time: formatTime(quote.timestamp), value: Number(quote.value) }))

  if (data.length === 0) {
    return (
      <div className="flex min-h-[256px] flex-1 items-center justify-center text-sm text-[var(--color-text-muted)]">
        Sem histórico de cotação ainda.
      </div>
    )
  }

  const formatCompact = makeCompactFormatter(data.map((point) => point.value))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          stroke="var(--color-text-muted)"
          fontSize={12}
          fontFamily="var(--font-mono)"
          tickLine={false}
          axisLine={false}
          minTickGap={40}
          allowDuplicatedCategory={false}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          fontSize={12}
          fontFamily="var(--font-mono)"
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          width={64}
          tickCount={5}
          tickFormatter={formatCompact}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
          }}
          labelStyle={{ fontFamily: 'var(--font-sans)' }}
          formatter={(value) => Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5, fill: 'var(--color-accent)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
