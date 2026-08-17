export interface Asset {
  id: number
  code: string
  name: string
  type: 'fiat' | 'crypto'
}

export type QuoteCurrency = 'BRL' | 'USD'

export interface Quote {
  id: number
  asset: number
  value: string
  quote_currency: QuoteCurrency
  timestamp: string
}

export interface WatchlistItem {
  id: number
  user: number
  asset: number
  added_at: string
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
