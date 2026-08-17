interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'up' | 'down'
}

const toneColor = {
  neutral: 'var(--color-text)',
  up: 'var(--color-up)',
  down: 'var(--color-down)',
}

export function StatCard({ label, value, hint, tone = 'neutral' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold" style={{ color: toneColor[tone] }}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  )
}
