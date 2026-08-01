import { http, HttpResponse } from 'msw'
import type { AuctionListRequest, SetBetRequest } from '@/shared/api/generated/model'
import { mockAuctionStore } from './store'

const apiError = (status: number, code: string, title: string, message: string) =>
  HttpResponse.json({ code, title, message, trace_id: `mock-${Date.now()}` }, { status })

export const handlers = [
  http.post('/auctions/list', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as AuctionListRequest
    return HttpResponse.json(mockAuctionStore.list(body as Record<string, unknown>))
  }),

  http.get('/auctions/:auctionUuid', ({ params }) => {
    const detail = mockAuctionStore.detail(String(params.auctionUuid))
    return detail
      ? HttpResponse.json(detail)
      : apiError(
          404,
          'auction_not_found',
          'Аукцион не найден',
          'Аукцион с указанным идентификатором не найден',
        )
  }),

  http.get('/auctions/:auctionUuid/bets', ({ params }) => {
    const fixture = mockAuctionStore.find(String(params.auctionUuid))
    if (!fixture)
      return apiError(
        404,
        'auction_not_found',
        'Аукцион не найден',
        'Аукцион с указанным идентификатором не найден',
      )
    if (fixture.detail.hide_bets_history || fixture.detail.trading.hide_bets_history)
      return apiError(
        404,
        'bets_hidden',
        'История ставок недоступна',
        'Организатор скрыл историю ставок',
      )
    return HttpResponse.json({ bets: mockAuctionStore.bets(fixture.uuid) ?? [] })
  }),

  http.post('/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const uuid = String(params.auctionUuid)
    const fixture = mockAuctionStore.find(uuid)
    if (!fixture)
      return apiError(
        404,
        'auction_not_found',
        'Аукцион не найден',
        'Аукцион с указанным идентификатором не найден',
      )

    const body = (await request.json().catch(() => ({}))) as Partial<SetBetRequest>
    const price = Number(body.price)
    const tradingPrice = fixture.detail.trading.price
    const step = tradingPrice?.step ?? 0
    const min = tradingPrice?.min ?? 0
    const max = tradingPrice?.max ?? Number.POSITIVE_INFINITY

    if (!fixture.detail.trading.can_set_bet)
      return apiError(
        422,
        'validation_failed',
        'Ставка недоступна',
        'Для этого аукциона нельзя установить ставку',
      )
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      price < min ||
      price > max ||
      (step > 0 && price % step !== 0)
    ) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Проверьте цену ставки',
          errors: [
            {
              field: 'price',
              message: `Цена должна быть от ${min} до ${max} с шагом ${step}`,
              code: 'invalid_value',
            },
          ],
        },
        { status: 422 },
      )
    }

    mockAuctionStore.setBet(uuid, price)
    return new HttpResponse(null, { status: 200 })
  }),
]
