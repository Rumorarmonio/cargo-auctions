import type { AuctionShowPayment } from '@/shared/api/generated/model'
import { getAuctionLabel } from '@/entities/auction/model/auction-labels'
import { AuctionDataTable } from './auction-data-table.component'
import { AuctionDetailSection } from './auction-detail-section.component'

export function AuctionPaymentInfo({ payment }: { payment: AuctionShowPayment }) {
  return (
    <AuctionDetailSection title='Оплата'>
      <AuctionDataTable
        rows={[
          ['Форма', payment.form ?? '—'],
          ['Условие', payment.condition ?? payment.condition_predefined ?? '—'],
          [
            'Отсрочка',
            payment.delay === null || payment.delay === undefined
              ? '—'
              : `${payment.delay} ${getAuctionLabel(payment.delay_type)}`,
          ],
          ['Предоплата', payment.prepay ?? '—'],
          ['Валюта', payment.currency_code ?? '—'],
        ]}
      />
    </AuctionDetailSection>
  )
}
