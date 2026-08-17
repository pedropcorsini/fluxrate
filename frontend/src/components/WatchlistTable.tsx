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
      <div className="rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-muted)]">
        Sua watchlist está vazia. Vá em "Explorar ativos" pra adicionar o primeiro.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-left text-[var(--color-text-muted)]">
            <th className="px-4 py-3 font-medium">Ativo</th>
            <th className="px-4 py-3 font-medium">Preço ({currency})</th>
            <th className="px-4 py-3 font-medium">Variação</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.watchlistId}
              onClick={() => onSelectAsset(row.asset.code)}
              className={`cursor-pointer border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-muted)] ${
                selectedAssetCode === row.asset.code ? 'bg-[var(--color-surface-muted)]' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="font-medium">{row.asset.code}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{row.asset.name}</div>
              </td>
              <td className="px-4 py-3">
                {row.latestValue !== null ? formatCurrency(row.latestValue, currency) : '—'}
              </td>
              <td className="px-4 py-3">
                {row.changePercent !== null ? (
                  <span style={{ color: row.changePercent >= 0 ? 'var(--color-up)' : 'var(--color-down)' }}>
                    {row.changePercent >= 0 ? '▲' : '▼'} {Math.abs(row.changePercent).toFixed(2)}%
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
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-down)]"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
