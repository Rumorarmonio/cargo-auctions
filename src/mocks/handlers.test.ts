import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { resetMockAuctionStore } from './store'

const server = setupServer(...handlers)

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`http://localhost${path}`, init)
  const body = await response.json().catch(() => null)
  return { response, body }
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => resetMockAuctionStore())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('MSW auction handlers', () => {
  it('returns paginated and filtered auctions', async () => {
    const { response, body } = await request('/auctions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, per_page: 2, cargo_num: 'CA-2026-00' }),
    })

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      meta: { total: 5, current_page: 1, per_page: 2 },
    })
    expect(body.data).toHaveLength(2)
  })

  it('returns detail and a not-found response', async () => {
    const detail = await request('/auctions/auction-nsk-001')
    const edgeCase = await request('/auctions/auction-barnaul-005')
    const missing = await request('/auctions/missing-auction')

    expect(detail.response.status).toBe(200)
    expect(detail.body.main.cargo_num).toBe('CA-2026-001')
    expect(edgeCase.response.status).toBe(200)
    expect(edgeCase.body.contacts).toEqual([])
    expect(edgeCase.body.routes).toHaveLength(4)
    expect(edgeCase.body.cargo.car).toBeNull()
    expect(missing.response.status).toBe(404)
    expect(missing.body.code).toBe('auction_not_found')
  })

  it('returns visible, empty and hidden bet histories', async () => {
    const visible = await request('/auctions/auction-nsk-001/bets')
    const allBets = await request('/auctions/auction-nsk-001/bets?all=true')
    const empty = await request('/auctions/auction-kem-004/bets')
    const hidden = await request('/auctions/auction-oms-002/bets')
    const edgeCase = await request('/auctions/auction-barnaul-005/bets?all=true')

    expect(visible.response.status).toBe(200)
    expect(visible.body.bets).toHaveLength(2)
    expect(allBets.response.status).toBe(200)
    expect(allBets.body.bets).toHaveLength(3)
    expect(allBets.body.bets[2].cancel_reason).toBe('Ставка отменена перевозчиком')
    expect(empty.response.status).toBe(200)
    expect(empty.body.bets).toEqual([])
    expect(hidden.response.status).toBe(404)
    expect(hidden.body.code).toBe('bets_hidden')
    expect(edgeCase.response.status).toBe(200)
    expect(edgeCase.body.bets[0]).toMatchObject({
      organization_name: '',
      place: null,
      cancel_reason: 'Ставка отменена организатором',
    })
  })

  it('rejects invalid bets and stores valid bets', async () => {
    const invalid = await request('/auctions/auction-nsk-001/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 999999 }),
    })
    const valid = await request('/auctions/auction-nsk-001/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 131000 }),
    })
    const history = await request('/auctions/auction-nsk-001/bets')

    expect(invalid.response.status).toBe(422)
    expect(invalid.body.code).toBe('validation_failed')
    expect(valid.response.status).toBe(200)
    expect(history.response.status).toBe(200)
    expect(history.body.bets[0]).toMatchObject({
      price_with_vat: 131000,
      is_win: true,
      place: 1,
    })
  })
})
