import { useEffect, useState } from 'react'
import { Check, CurrencyDollar, Plus } from '@phosphor-icons/react'
import { api } from '../lib/api'
import type { Asset, Paginated, WatchlistItem } from '../lib/types'

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [assetsRes, watchlistRes] = await Promise.all([
        api.get<Paginated<Asset>>('/assets/', { params: { page_size: 100 } }),
        api.get<Paginated<WatchlistItem>>('/watchlist/'),
      ])
      setAssets(assetsRes.data.results)
      setWatchlist(watchlistRes.data.results)
      setIsLoading(false)
    }
    load()
  }, [])

  const watchlistedAssetIds = new Set(watchlist.map((item) => item.asset))

  async function handleAdd(assetId: number) {
    const { data } = await api.post<WatchlistItem>('/watchlist/', { asset: assetId })
    setWatchlist((current) => [...current, data])
  }

  if (isLoading) {
    return <p className="mx-auto max-w-6xl px-6 py-8 text-sm text-[var(--color-text-muted)]">Carregando...</p>
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-1 text-2xl font-semibold">Explorar ativos</h1>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Catálogo completo de fiat e crypto disponíveis pra acompanhar.
      </p>

      <div className="glass-panel overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)]">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const alreadyAdded = watchlistedAssetIds.has(asset.id)
              return (
                <tr
                  key={asset.id}
                  className="border-b border-[var(--color-border)] transition-colors last:border-0 hover:bg-[var(--color-surface-muted)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <CurrencyDollar
                        size={16}
                        weight="bold"
                        className="text-[var(--color-text-muted)]"
                        aria-hidden="true"
                      />
                      {asset.code}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{asset.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] capitalize">{asset.type}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={alreadyAdded}
                      onClick={() => handleAdd(asset.id)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                        alreadyAdded
                          ? 'border-[var(--color-border)] text-[var(--color-text-muted)] opacity-70'
                          : 'border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]'
                      }`}
                    >
                      {alreadyAdded ? (
                        <>
                          <Check size={14} weight="bold" aria-hidden="true" />
                          Na watchlist
                        </>
                      ) : (
                        <>
                          <Plus size={14} weight="bold" aria-hidden="true" />
                          Adicionar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
