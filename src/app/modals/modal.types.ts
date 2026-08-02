import type { AuctionListFilters } from '@/features/auction-filters/model/types'
import type { ComponentType } from 'react'

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
export type ModalContentProps<T extends ModalId> = {
  params?: ModalParamsFor<T>
}
export type ModalContentMap = {
  [T in ModalId]: ComponentType<ModalContentProps<T>>
}
export type ModalStateById = {
  [T in ModalId]?: {
    isOpen: boolean
    isClosing: boolean
    closeSequence: number
    params?: ModalParamsFor<T>
  }
}

export type ModalDefinition<T extends ModalId = ModalId> = {
  id: T
  kind: ModalKind
  position?: ModalPosition
  title?: string
  width?: string
  mobileFullWidth?: boolean
}

export type AnyModalDefinition = {
  [T in ModalId]: ModalDefinition<T>
}[ModalId]
