import { useQuery } from '@tanstack/react-query'
import { listBets } from '@/shared/api/generated/auctions/auctions'
import type { BetListResponse } from '@/shared/api/generated/model'

export class AuctionBetsRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Не удалось загрузить историю ставок: HTTP ${status}`)
    this.name = 'AuctionBetsRequestError'
  }
}

export const auctionBetsQueryKey = (auctionUuid: string) =>
  ['auctions', 'bets', auctionUuid] as const

export function auctionBetsQueryOptions(auctionUuid: string, enabled = true) {
  return {
    queryKey: auctionBetsQueryKey(auctionUuid),
    queryFn: async (): Promise<BetListResponse> => {
      const response = await listBets(auctionUuid, { all: true })
      if (response.status !== 200) throw new AuctionBetsRequestError(response.status)
      return response.data
    },
    enabled: enabled && auctionUuid.length > 0,
  }
}

export function useAuctionBetsQuery(auctionUuid: string, enabled = true) {
  return useQuery(auctionBetsQueryOptions(auctionUuid, enabled))
}
