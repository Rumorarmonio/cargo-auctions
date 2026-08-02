import type { AuctionListFilters } from '@/features/auction-filters/model/types'

export type ModalPosition = 'center' | 'left' | 'right'
export type ModalKind = 'modal' | 'drawer'

export type StatusModalParams = {
  variant: 'success' | 'error' | 'neutral'
  title?: string
  message?: string
}

export type ModalParamsById = {
  demoLeft: undefined
  demoCenter: undefined
  demoRight: undefined
  status: StatusModalParams
  auctionFilters: {
    initialFilters: AuctionListFilters
    onApply: (filters: AuctionListFilters) => void
  }
}

export type ModalId = keyof ModalParamsById
export type ModalParamsFor<T extends ModalId> = ModalParamsById[T]
export type ModalParams = ModalParamsById[ModalId]

export type ModalDefinition<T extends ModalId = ModalId> = {
  id: T
  kind: ModalKind
  position?: ModalPosition
  title?: string
  width?: string
  mobileFullWidth?: boolean
}
