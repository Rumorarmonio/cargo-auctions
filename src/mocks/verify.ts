type MockCheckResult = {
  status: number
  body: unknown
}

async function request(url: string, options?: RequestInit): Promise<MockCheckResult> {
  const response = await fetch(url, options)
  const body = await response.json().catch(() => null)

  return { status: response.status, body }
}

function assertCheck(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export async function verifyMockApi() {
  try {
    const list = await request('/auctions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, per_page: 2 }),
    })
    const detail = await request('/auctions/auction-nsk-001')
    const bets = await request('/auctions/auction-nsk-001/bets')
    const invalidBet = await request('/auctions/auction-nsk-001/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 999999 }),
    })

    assertCheck(list.status === 200, `Список вернул HTTP ${list.status}`)
    assertCheck(
      Array.isArray((list.body as { data?: unknown[] })?.data),
      'Список не содержит data[]',
    )
    assertCheck(
      (list.body as { meta?: { total?: number } })?.meta?.total === 4,
      'Список содержит не 4 seed-аукциона',
    )
    assertCheck(detail.status === 200, `Detail вернул HTTP ${detail.status}`)
    assertCheck(bets.status === 200, `История ставок вернула HTTP ${bets.status}`)
    assertCheck(invalidBet.status === 422, `Невалидная ставка вернула HTTP ${invalidBet.status}`)

    console.groupCollapsed('[MSW] Mock API smoke check')
    console.info('POST /auctions/list', {
      status: list.status,
      items: (list.body as { data?: unknown[] })?.data?.length ?? 0,
      total: (list.body as { meta?: { total?: number } })?.meta?.total,
    })
    console.info('GET /auctions/auction-nsk-001', {
      status: detail.status,
      cargoNumber: (detail.body as { main?: { cargo_num?: string } })?.main?.cargo_num,
    })
    console.info('GET /auctions/auction-nsk-001/bets', {
      status: bets.status,
      items: (bets.body as { bets?: unknown[] })?.bets?.length ?? 0,
    })
    console.info('POST /auctions/auction-nsk-001/bets with invalid price', {
      status: invalidBet.status,
      expectedStatus: 422,
    })
    console.groupEnd()
  } catch (error) {
    console.error('[MSW] Mock API smoke check failed', error)
  }
}
