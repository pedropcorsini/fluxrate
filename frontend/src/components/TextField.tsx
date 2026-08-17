import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function TextField({ label, id, ...inputProps }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[var(--color-text-muted)]">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
        {...inputProps}
      />
    </div>
  )
}
