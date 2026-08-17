import { useEffect, useMemo, useState } from 'react'
import { ChartLineUp, Clock, ListStar, TrendDown, TrendUp } from '@phosphor-icons/react'
import { api } from '../lib/api'
import type { Asset, Paginated, Quote, QuoteCurrency, WatchlistItem } from '../lib/types'
import { StatCard } from '../components/StatCard'
import { PriceChart } from '../components/PriceChart'
import { WatchlistTable, type WatchlistRow } from '../components/WatchlistTable'

export function DashboardPage() {
  const [currency, setCurrency] = useState<QuoteCurrency>('BRL')
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [assetsById, setAssetsById] = useState<Map<number, Asset>>(new Map())
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([])
  const [selectedAssetCode, setSelectedAssetCode] = useState<string | null>(null)
  const [assetHistory, setAssetHistory] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadOverview() {
      setIsLoading(true)
      const [watchlistRes, assetsRes, quotesRes] = await Promise.all([
        api.get<Paginated<WatchlistItem>>('/watchlist/'),
        api.get<Paginated<Asset>>('/assets/', { params: { page_size: 100 } }),
        api.get<Paginated<Quote>>('/quotes/', { params: { currency, page_size: 40 } }),
      ])

      if (cancelled) return

      setWatchlist(watchlistRes.data.results)
      setAssetsById(new Map(assetsRes.data.results.map((asset) => [asset.id, asset])))
      setRecentQuotes(quotesRes.data.results)
      setIsLoading(false)
    }

    loadOverview()
    return () => {
      cancelled = true
    }
  }, [currency])

  // Escolhe o primeiro ativo da watchlist como selecionado quando ela carrega.
  useEffect(() => {
    if (!selectedAssetCode && watchlist.length > 0) {
      const first = assetsById.get(watchlist[0].asset)
      if (first) setSelectedAssetCode(first.code)
    }
  }, [watchlist, assetsById, selectedAssetCode])

  useEffect(() => {
    if (!selectedAssetCode) {
      setAssetHistory([])
      return
    }
    let cancelled = false
    api
      .get<Paginated<Quote>>('/quotes/', { params: { asset: selectedAssetCode, currency, page_size: 30 } })
      .then((res) => {
        if (!cancelled) setAssetHistory(res.data.results)
      })
    return () => {
      cancelled = true
    }
  }, [selectedAssetCode, currency])

  const quotesByAsset = useMemo(() => {
    const grouped = new Map<number, Quote[]>()
    for (const quote of recentQuotes) {
      const list = grouped.get(quote.asset) ?? []
      list.push(quote)
      grouped.set(quote.asset, list)
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }
    return grouped
  }, [recentQuotes])

  const watchlistRows: WatchlistRow[] = useMemo(
    () =>
      watchlist
        .map((item) => {
          const asset = assetsById.get(item.asset)
          if (!asset) return null
          const quotes = quotesByAsset.get(asset.id) ?? []
          const latest = quotes[0] ? Number(quotes[0].value) : null
          const previous = quotes[1] ? Number(quotes[1].value) : null
          const changePercent = latest !== null && previous ? ((latest - previous) / previous) * 100 : null
          return { watchlistId: item.id, asset, latestValue: latest, changePercent }
        })
        .filter((row): row is WatchlistRow => row !== null),
    [watchlist, assetsById, quotesByAsset],
  )

  const stats = useMemo(() => {
    const withChange = watchlistRows.filter((row) => row.changePercent !== null)
    const topGainer = withChange.reduce<WatchlistRow | null>(
      (best, row) => (!best || row.changePercent! > best.changePercent!) ? row : best,
      null,
    )
    const topLoser = withChange.reduce<WatchlistRow | null>(
      (worst, row) => (!worst || row.changePercent! < worst.changePercent!) ? row : worst,
      null,
    )
    const lastUpdate = recentQuotes[0]?.timestamp

    return { topGainer, topLoser, lastUpdate }
  }, [watchlistRows, recentQuotes])

  async function handleRemove(watchlistId: number) {
    await api.delete(`/watchlist/${watchlistId}/`)
    setWatchlist((current) => current.filter((item) => item.id !== watchlistId))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="glass-panel flex overflow-hidden rounded-lg">
          {(['BRL', 'USD'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setCurrency(option)}
              className={`font-numeric cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                currency === option
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ativos na watchlist" value={String(watchlistRows.length)} icon={ListStar} />
        <StatCard
          label="Maior alta"
          value={stats.topGainer ? `${stats.topGainer.asset.code} +${stats.topGainer.changePercent!.toFixed(2)}%` : '—'}
          tone="up"
          icon={TrendUp}
        />
        <StatCard
          label="Maior queda"
          value={stats.topLoser ? `${stats.topLoser.asset.code} ${stats.topLoser.changePercent!.toFixed(2)}%` : '—'}
          tone="down"
          icon={TrendDown}
        />
        <StatCard
          label="Última atualização"
          value={stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString('pt-BR') : '—'}
          icon={Clock}
        />
      </div>

      <div className="glass-panel mb-6 rounded-xl p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          <ChartLineUp size={16} weight="bold" aria-hidden="true" />
          {selectedAssetCode ? `Histórico de preço de ${selectedAssetCode}` : 'Selecione um ativo na watchlist'}
        </h2>
        <PriceChart quotes={assetHistory} />
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <WatchlistTable
          rows={watchlistRows}
          selectedAssetCode={selectedAssetCode}
          onSelectAsset={setSelectedAssetCode}
          onRemove={handleRemove}
          currency={currency}
        />
      )}
    </div>
  )
}
