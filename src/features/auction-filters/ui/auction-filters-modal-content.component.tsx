import type { ModalParamsFor } from '@/app/modals/modal.types'
import { createEmptyAuctionListFilters } from '../model/filters'
import { AuctionFiltersForm } from './auction-filters-form.component'

export function AuctionFiltersModalContent({
  params,
}: {
  params?: ModalParamsFor<'auctionFilters'>
}) {
  return (
    <AuctionFiltersForm
      initialFilters={params?.initialFilters ?? createEmptyAuctionListFilters()}
      onApply={params?.onApply ?? (() => undefined)}
    />
  )
}
