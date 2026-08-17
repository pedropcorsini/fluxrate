import type { Icon } from '@phosphor-icons/react'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'up' | 'down'
  icon: Icon
}

const toneStyles = {
  neutral: { color: 'var(--color-text)', bg: 'var(--color-surface-muted)' },
  up: { color: 'var(--color-up)', bg: 'color-mix(in srgb, var(--color-up) 15%, transparent)' },
  down: { color: 'var(--color-down)', bg: 'color-mix(in srgb, var(--color-down) 15%, transparent)' },
}

export function StatCard({ label, value, hint, tone = 'neutral', icon: IconComponent }: StatCardProps) {
  const { color, bg } = toneStyles[tone]

  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: bg, color }}
        >
          <IconComponent size={18} weight="bold" aria-hidden="true" />
        </span>
      </div>
      <p className="font-numeric mt-3 text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  )
}
