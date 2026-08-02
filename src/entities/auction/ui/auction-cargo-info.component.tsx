import type { AuctionShowCargo } from '@/shared/api/generated/model'
import { formatNumber } from '@/shared/lib/formatters'
import { AuctionDataTable } from './auction-data-table.component'
import { AuctionDetailSection } from './auction-detail-section.component'

export function AuctionCargoInfo({
  cargo,
  hideCargoPrice,
}: {
  cargo: AuctionShowCargo
  hideCargoPrice: boolean
}) {
  return (
    <AuctionDetailSection title='Груз'>
      <AuctionDataTable
        rows={[
          ['Стоимость груза', hideCargoPrice ? 'Скрыта организатором' : (cargo.price ?? '—')],
          ['Расстояние', formatNumber(cargo.distance, ' км')],
          ['Количество машин', cargo.truck_count ?? '—'],
          ['Тип кузова', cargo.body_type ?? '—'],
          [
            'Температура',
            cargo.temp_from !== null || cargo.temp_to !== null
              ? `${cargo.temp_from ?? '—'}…${cargo.temp_to ?? '—'} °C`
              : '—',
          ],
          ['Ремни', formatNumber(cargo.belts)],
          ['Крепления', formatNumber(cargo.conics)],
          ['Тип требуемого ТС', cargo.car?.type ?? '—'],
          ['Грузоподъёмность ТС', formatNumber(cargo.car?.weight, ' т')],
          ['Объём ТС', formatNumber(cargo.car?.volume, ' м³')],
        ]}
      />
    </AuctionDetailSection>
  )
}
