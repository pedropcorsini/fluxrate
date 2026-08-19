import { TrendDown, TrendUp, X } from '@phosphor-icons/react'
import type { Asset } from '../lib/types'

export interface WatchlistRow {
  watchlistId: number
  asset: Asset
  latestValue: number | null
  changePercent: number | null
}

interface WatchlistTableProps {
  rows: WatchlistRow[]
  selectedAssetCode: string | null
  onSelectAsset: (code: string) => void
  onRemove: (watchlistId: number) => void
  currency: string
}

function formatCurrency(value: number, currency: string) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency, minimumFractionDigits: 2 })
}

export function WatchlistTable({ rows, selectedAssetCode, onSelectAsset, onRemove, currency }: WatchlistTableProps) {
  if (rows.length === 0) {
    return (
      <div className="glass-panel rounded-xl border-dashed p-8 text-center text-sm text-[var(--color-text-muted)]">
        Sua watchlist está vazia. Vá em "Explorar ativos" pra adicionar o primeiro.
      </div>
    )
  }

  return (
    <div className="max-h-full overflow-y-auto lg:max-h-[420px]">
      <table className="w-full text-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)] text-left text-[var(--color-text-muted)] backdrop-blur">
            <th className="px-4 py-3 font-medium">Ativo</th>
            <th className="px-4 py-3 font-medium">Preço ({currency})</th>
            <th className="px-4 py-3 font-medium">Variação</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isUp = (row.changePercent ?? 0) >= 0
            return (
              <tr
                key={row.watchlistId}
                onClick={() => onSelectAsset(row.asset.code)}
                className={`cursor-pointer border-b border-l-2 border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-muted)] ${
                  selectedAssetCode === row.asset.code
                    ? 'border-l-[var(--color-accent)] bg-[var(--color-surface-muted)]'
                    : 'border-l-transparent'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{row.asset.code}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{row.asset.name}</div>
                </td>
                <td className="font-numeric px-4 py-3">
                  {row.latestValue !== null ? formatCurrency(row.latestValue, currency) : '—'}
                </td>
                <td className="px-4 py-3">
                  {row.changePercent !== null ? (
                    <span
                      className="font-numeric inline-flex items-center gap-1"
                      style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}
                    >
                      {isUp ? (
                        <TrendUp size={14} weight="bold" aria-hidden="true" />
                      ) : (
                        <TrendDown size={14} weight="bold" aria-hidden="true" />
                      )}
                      {Math.abs(row.changePercent).toFixed(2)}%
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onRemove(row.watchlistId)
                    }}
                    aria-label={`Remover ${row.asset.code} da watchlist`}
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-down)]/10 hover:text-[var(--color-down)]"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
