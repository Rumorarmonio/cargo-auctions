export type AuctionListFilters = {
  cargo_num: string
  status: string | undefined
  statuses: string[]
  auc_type: string | undefined
  auc_types: string[]
  load_city: string | undefined
  unload_city: string | undefined
  load_date_from: string
  load_date_to: string
  is_available: boolean
  is_bidder: boolean
  current_price_from: number | undefined
  current_price_to: number | undefined
}
