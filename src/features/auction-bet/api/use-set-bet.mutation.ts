import { useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionDetailQueryKey } from '@/entities/auction/api/use-auction-detail.query'
import { setBet } from '@/shared/api/generated/auctions/auctions'
import type { SetBetRequest } from '@/shared/api/generated/model'

export class AuctionBetRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'AuctionBetRequestError'
  }
}

const getErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data !== 'object' || data === null) return fallback
  if ('message' in data && typeof data.message === 'string') return data.message
  return fallback
}

export function useSetBetMutation(auctionUuid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SetBetRequest) => {
      const response = await setBet(auctionUuid, data)
      if (response.status !== 200) {
        throw new AuctionBetRequestError(
          response.status,
          getErrorMessage(response.data, 'Не удалось установить ставку'),
        )
      }
      return response
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: auctionDetailQueryKey(auctionUuid) }),
        queryClient.invalidateQueries({ queryKey: ['auctions', 'list'] }),
      ])
    },
  })
}
