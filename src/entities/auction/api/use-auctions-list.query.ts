import { useQuery } from '@tanstack/react-query'
import { listAuctions, type listAuctionsResponse } from '@/shared/api/generated/auctions/auctions'
import type { AuctionListRequest } from '@/shared/api/generated/model'

export class AuctionsListRequestError extends Error {
  constructor(public readonly response: Exclude<listAuctionsResponse, { status: 200 }>) {
    super(`Не удалось загрузить список аукционов: HTTP ${response.status}`)
    this.name = 'AuctionsListRequestError'
  }
}

export function useAuctionsListQuery(request?: AuctionListRequest) {
  return useQuery({
    queryKey: ['auctions', 'list', request ?? {}],
    queryFn: async () => {
      const response = await listAuctions(request)

      if (response.status !== 200) {
        throw new AuctionsListRequestError(response)
      }

      return response.data
    },
  })
}
