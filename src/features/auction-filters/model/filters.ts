import type { AuctionListFilters } from './types'

export const cityOptions = ['Новосибирск', 'Омск', 'Томск', 'Кемерово'].map((city) => ({
  value: city,
  label: city,
}))

export const statusOptions = [
  { value: '2', label: 'Идут торги' },
  { value: '1', label: 'Планирование' },
  { value: '6', label: 'Завершён' },
]

export const typeOptions = [
  { value: 'Request', label: 'Заявка' },
  { value: 'Up', label: 'Повышение' },
  { value: 'Down', label: 'Понижение' },
  { value: 'FixPrice', label: 'Фиксированная цена' },
]

export function createEmptyAuctionListFilters(): AuctionListFilters {
  return {
    cargo_num: '',
    status: undefined,
    statuses: [],
    auc_type: undefined,
    auc_types: [],
    load_city: undefined,
    unload_city: undefined,
    load_date_from: '',
    load_date_to: '',
    is_available: false,
    is_bidder: false,
    current_price_from: undefined,
    current_price_to: undefined,
  }
}

export function mergeAuctionListFilters(
  filters: AuctionListFilters,
  next: Partial<AuctionListFilters>,
): AuctionListFilters {
  return { ...filters, ...next }
}
