import { useEffect, useState } from 'react'
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
      <h1 className="mb-6 text-2xl font-semibold">Explorar ativos</h1>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-left text-[var(--color-text-muted)]">
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
                <tr key={asset.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{asset.code}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">{asset.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] capitalize">{asset.type}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={alreadyAdded}
                      onClick={() => handleAdd(asset.id)}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {alreadyAdded ? 'Na watchlist' : 'Adicionar'}
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
