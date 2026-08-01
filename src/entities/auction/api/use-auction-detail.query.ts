import { useQuery } from '@tanstack/react-query'
import { getAuction } from '@/shared/api/generated/auctions/auctions'

export class AuctionDetailRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Не удалось загрузить аукцион: HTTP ${status}`)
    this.name = 'AuctionDetailRequestError'
  }
}

export const auctionDetailQueryKey = (auctionUuid: string) =>
  ['auctions', 'detail', auctionUuid] as const

export function auctionDetailQueryOptions(auctionUuid: string) {
  return {
    queryKey: auctionDetailQueryKey(auctionUuid),
    queryFn: async () => {
      const response = await getAuction(auctionUuid)
      if (response.status !== 200) throw new AuctionDetailRequestError(response.status)
      return response.data
    },
  }
}

export function useAuctionDetailQuery(auctionUuid: string) {
  return useQuery(auctionDetailQueryOptions(auctionUuid))
}
