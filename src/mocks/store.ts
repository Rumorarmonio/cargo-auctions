import type { AuctionListItem, AuctionShowResponse, BetItem } from '@/shared/api/generated/model'
import { auctionFixtures, type AuctionFixture } from './fixtures'

let fixtures = structuredClone(auctionFixtures)

const auctionStatuses = [
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
]
const tradingStatuses = ['NotParticipating', 'Leading', 'Losing', 'Winner', 'Confirmed']

function matchesNumberRange(value: number | undefined, from: unknown, to: unknown) {
  if (from !== undefined && from !== null && (value ?? 0) < Number(from)) return false
  if (to !== undefined && to !== null && (value ?? 0) > Number(to)) return false
  return true
}

function matchesDateRange(value: string | undefined, from: unknown, to: unknown) {
  if (!value) return false
  const valueTimestamp = Date.parse(value)
  if (Number.isNaN(valueTimestamp)) return false
  if (from !== undefined && from !== null) {
    const fromTimestamp = Date.parse(String(from))
    if (!Number.isNaN(fromTimestamp) && valueTimestamp < fromTimestamp) return false
  }
  if (to !== undefined && to !== null) {
    const toTimestamp = Date.parse(String(to))
    if (!Number.isNaN(toTimestamp) && valueTimestamp > toTimestamp) return false
  }
  return true
}

export const mockAuctionStore = {
  list(request: { page?: number; per_page?: number; [key: string]: unknown } = {}) {
    let items = fixtures
    const statuses = Array.isArray(request.statuses) ? (request.statuses as number[]) : undefined
    const auctionTypes = Array.isArray(request.auc_type)
      ? (request.auc_type as string[])
      : undefined
    const userStatuses = Array.isArray(request.status) ? (request.status as string[]) : undefined
    const mobileStatuses = Array.isArray(request.mobile_statuses)
      ? (request.mobile_statuses as number[])
      : undefined
    const bodyTypes = Array.isArray(request.body_types)
      ? (request.body_types as string[])
      : undefined

    if (request.cargo_num) {
      const value = String(request.cargo_num).toLowerCase()
      items = items.filter(({ listItem }) =>
        listItem.main?.cargo_num?.toLowerCase().includes(value),
      )
    }
    if (request.load_city) {
      const value = String(request.load_city).toLowerCase()
      items = items.filter(({ listItem }) =>
        listItem.route?.load?.city?.toLowerCase().includes(value),
      )
    }
    if (request.unload_city) {
      const value = String(request.unload_city).toLowerCase()
      items = items.filter(({ listItem }) =>
        listItem.route?.unload?.city?.toLowerCase().includes(value),
      )
    }
    if (statuses) {
      items = items.filter(({ listItem }) =>
        statuses.some((status) => auctionStatuses[Number(status) - 1] === listItem.trading?.status),
      )
    }
    if (auctionTypes) {
      items = items.filter(({ listItem }) => auctionTypes.includes(listItem.main?.auc_type ?? ''))
    }
    if (userStatuses) {
      items = items.filter(({ listItem }) =>
        userStatuses.includes(listItem.trading?.status_mobile ?? ''),
      )
    }
    if (mobileStatuses) {
      items = items.filter(({ listItem }) =>
        mobileStatuses.some(
          (status) => tradingStatuses[Number(status) - 1] === listItem.trading?.status_mobile,
        ),
      )
    }
    if (bodyTypes) {
      items = items.filter(({ listItem }) => bodyTypes.includes(listItem.cargo?.body_type ?? ''))
    }
    if (request.is_international_shipment === true) {
      items = items.filter(({ listItem }) => listItem.cargo?.is_international)
    }
    if (request.is_favorite === true) {
      items = items.filter(({ listItem }) => listItem.trading?.is_favorite)
    }
    if (request.load_date_from !== undefined || request.load_date_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesDateRange(listItem.route?.load?.date, request.load_date_from, request.load_date_to),
      )
    }
    if (request.unload_date_from !== undefined || request.unload_date_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesDateRange(
          listItem.route?.unload?.date,
          request.unload_date_from,
          request.unload_date_to,
        ),
      )
    }
    if (request.create_date_from !== undefined || request.create_date_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesDateRange(
          listItem.main?.created_at,
          request.create_date_from,
          request.create_date_to,
        ),
      )
    }
    if (request.start_time_from !== undefined || request.start_time_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesDateRange(
          listItem.trading?.start_time,
          request.start_time_from,
          request.start_time_to,
        ),
      )
    }
    if (request.stop_time_from !== undefined || request.stop_time_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesDateRange(listItem.trading?.stop_time, request.stop_time_from, request.stop_time_to),
      )
    }
    if (request.weight_from !== undefined || request.weight_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesNumberRange(listItem.cargo?.weight, request.weight_from, request.weight_to),
      )
    }
    if (request.volume_from !== undefined || request.volume_to !== undefined) {
      items = items.filter(({ listItem }) =>
        matchesNumberRange(listItem.cargo?.volume, request.volume_from, request.volume_to),
      )
    }
    if (request.is_available === true)
      items = items.filter(({ listItem }) => listItem.trading?.is_available)
    if (request.is_bidder === true)
      items = items.filter(({ listItem }) => listItem.trading?.is_bidder)
    if (request.current_price_from !== undefined && request.current_price_from !== null) {
      items = items.filter(
        ({ listItem }) =>
          (listItem.trading?.price?.current ?? 0) >= Number(request.current_price_from),
      )
    }
    if (request.current_price_to !== undefined && request.current_price_to !== null) {
      items = items.filter(
        ({ listItem }) =>
          (listItem.trading?.price?.current ?? 0) <= Number(request.current_price_to),
      )
    }

    if (request.is_oldest === true) {
      items = [...items].sort((left, right) =>
        String(left.listItem.main?.created_at).localeCompare(
          String(right.listItem.main?.created_at),
        ),
      )
    }

    const page = Math.max(1, Number(request.page ?? 1))
    const perPage = Math.max(1, Math.min(50, Number(request.per_page ?? 2)))
    const start = (page - 1) * perPage

    return {
      data: items.slice(start, start + perPage).map(({ listItem }) => structuredClone(listItem)),
      meta: {
        current_page: page,
        from: items.slice(start, start + perPage).length === 0 ? 0 : start + 1,
        last_page: Math.max(1, Math.ceil(items.length / perPage)),
        per_page: perPage,
        to:
          items.slice(start, start + perPage).length === 0
            ? 0
            : Math.min(start + perPage, items.length),
        total: items.length,
      },
    }
  },

  find(uuid: string): AuctionFixture | undefined {
    return fixtures.find((fixture) => fixture.uuid === uuid)
  },

  detail(uuid: string): AuctionShowResponse | undefined {
    const fixture = this.find(uuid)
    return fixture ? structuredClone(fixture.detail) : undefined
  },

  bets(uuid: string, all = false): BetItem[] | undefined {
    const fixture = this.find(uuid)
    if (!fixture) return undefined

    const bets = all
      ? fixture.bets
      : fixture.bets.filter((bet) => !bet.cancel_reason && bet.is_rejected !== true)

    return structuredClone(bets)
  },

  setBet(uuid: string, price: number): boolean {
    const fixture = this.find(uuid)
    const tradingPrice = fixture?.detail.trading.price
    if (!fixture || !tradingPrice) return false

    const previousBet = fixture.detail.trading.your?.last_bet
    const priceNoVat = Math.round((price / 1.2) * 100) / 100
    const nextBet: BetItem = {
      id: 10000 + fixture.bets.length + 1,
      created_at: new Date().toISOString(),
      auction_id: fixture.detail.main.id,
      subscriber_id: 999,
      contact_name: 'Текущий пользователь',
      contact_phone: '+7 900 555-00-00',
      price_with_vat: price,
      price_no_vat: priceNoVat,
      organization_id: 999,
      organization_inn: '5401999999',
      organization_name: 'ООО «Текущий перевозчик»',
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: true,
      run_number: 0,
      cancel_reason: '',
      price_info: {
        price_with_vat: price,
        price_no_vat: priceNoVat,
        payment_type: 'После доставки',
        vat_rate: '20',
      },
    }

    fixture.bets = [nextBet, ...fixture.bets].map((bet, index) => ({
      ...bet,
      place: index + 1,
      is_win: index === 0,
    }))
    if (previousBet !== null && previousBet !== undefined && fixture.bets[1]) {
      fixture.bets[1] = { ...fixture.bets[1], is_win: false, is_rejected: false }
    }

    tradingPrice.current = price
    tradingPrice.current_no_vat = priceNoVat
    tradingPrice.available = Math.max(price - (tradingPrice.step ?? 0), 0)
    tradingPrice.available_no_vat = Math.round(((tradingPrice.available ?? 0) / 1.2) * 100) / 100
    fixture.detail.trading.your = { bet: true, last_bet: price }
    fixture.detail.trading.status_mobile = 'Leading'
    fixture.listItem.trading = {
      ...fixture.listItem.trading,
      status_mobile: 'Leading',
      is_bidder: true,
      your: { bet: true, last_bet: price },
      price: { ...fixture.listItem.trading?.price, current: price, current_no_vat: priceNoVat },
    }
    return true
  },
}

export function resetMockAuctionStore() {
  fixtures = structuredClone(auctionFixtures)
}

export type MockAuctionList = ReturnType<typeof mockAuctionStore.list>
export type MockAuctionDetail = AuctionShowResponse
export type MockAuctionListItem = AuctionListItem
