import { Alert, Table, Text } from '@mantine/core'
import { useAuctionBetsQuery } from '@/entities/auction/api/use-auction-bets.query'
import type { BetItem } from '@/shared/api/generated/model'
import { formatDate, formatPrice } from '@/shared/lib/formatters'

export function AuctionBetsHistory({
  auctionUuid,
  hidden,
  hidePlaces,
}: {
  auctionUuid: string
  hidden: boolean
  hidePlaces: boolean
}) {
  const query = useAuctionBetsQuery(auctionUuid, !hidden)

  if (hidden) return <Text c='dimmed'>История ставок скрыта организатором.</Text>
  if (query.isPending) return <Text c='dimmed'>Загрузка истории ставок…</Text>

  if (query.isError) {
    return (
      <Alert
        color='red'
        title='Не удалось загрузить историю ставок'
      >
        Попробуйте обновить страницу позже.
      </Alert>
    )
  }

  const bets = query.data?.bets ?? []
  if (bets.length === 0) return <Text c='dimmed'>Ставок пока нет.</Text>

  return (
    <Table.ScrollContainer minWidth={760}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Дата</Table.Th>
            <Table.Th>Цена с НДС</Table.Th>
            <Table.Th>Цена без НДС</Table.Th>
            <Table.Th>Перевозчик</Table.Th>
            <Table.Th>Место</Table.Th>
            <Table.Th>Результат</Table.Th>
            <Table.Th>Отмена</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bets.map((bet) => (
            <AuctionBetRow
              key={bet.id ?? `${bet.created_at}-${bet.organization_id}`}
              bet={bet}
              hidePlaces={hidePlaces}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function AuctionBetRow({ bet, hidePlaces }: { bet: BetItem; hidePlaces: boolean }) {
  const priceWithVat = bet.price_info?.price_with_vat ?? bet.price_with_vat
  const priceNoVat = bet.price_info?.price_no_vat ?? bet.price_no_vat
  const isCanceled = Boolean(bet.cancel_reason) || bet.is_rejected === true

  return (
    <Table.Tr>
      <Table.Td>{formatDate(bet.created_at, true)}</Table.Td>
      <Table.Td>{formatPrice(priceWithVat)}</Table.Td>
      <Table.Td>{formatPrice(priceNoVat)}</Table.Td>
      <Table.Td>
        <Text>{bet.organization_name || 'Перевозчик не указан'}</Text>
        {bet.contact_name && (
          <Text
            size='xs'
            c='dimmed'
          >
            {bet.contact_name}
          </Text>
        )}
      </Table.Td>
      <Table.Td>{hidePlaces ? '—' : (bet.place ?? '—')}</Table.Td>
      <Table.Td>{bet.is_win ? 'Победитель' : '—'}</Table.Td>
      <Table.Td>{isCanceled ? bet.cancel_reason || 'Отменена' : '—'}</Table.Td>
    </Table.Tr>
  )
}
