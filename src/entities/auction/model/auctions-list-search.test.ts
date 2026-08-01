import { describe, expect, it } from 'vitest'
import { auctionsListSearchSchema, toAuctionsListRequest } from './auctions-list-search'

describe('auctions list search', () => {
  it('normalizes URL search values and converts dates to API format', () => {
    const search = auctionsListSearchSchema.parse({
      page: '2',
      per_page: '10',
      statuses: '1,invalid,3',
      load_date_from: '2026-08-05',
      load_date_to: '2026-08-07',
      is_available: 'true',
      is_bidder: 'false',
      current_price_from: '100000',
      unknown_filter: 'preserved',
    })

    expect(toAuctionsListRequest(search)).toEqual({
      page: 2,
      per_page: 10,
      statuses: [1, 3],
      load_date_from: '2026-08-05T00:00:00Z',
      load_date_to: '2026-08-07T23:59:59Z',
      is_available: true,
      is_bidder: undefined,
      current_price_from: 100000,
      current_price_to: undefined,
      cargo_num: undefined,
      status: undefined,
      auc_type: undefined,
      load_city: undefined,
      unload_city: undefined,
    })
    expect(search.unknown_filter).toBe('preserved')
  })

  it('uses safe defaults for invalid pagination values', () => {
    const search = auctionsListSearchSchema.parse({ page: '0', per_page: '100' })

    expect(search.page).toBe(1)
    expect(search.per_page).toBe(2)
  })
})
