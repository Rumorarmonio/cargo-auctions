import {
  Alert,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Link, useParams } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail.query'
import { getAuctionLabel } from '@/entities/auction/model/auction-labels'
import { AuctionBetsHistory } from '@/entities/auction/ui/auction-bets-history.component'
import { AuctionCargoInfo } from '@/entities/auction/ui/auction-cargo-info.component'
import { AuctionDataTable } from '@/entities/auction/ui/auction-data-table.component'
import { AuctionDetailSection } from '@/entities/auction/ui/auction-detail-section.component'
import { AuctionOrganizerInfo } from '@/entities/auction/ui/auction-organizer-info.component'
import { AuctionPaymentInfo } from '@/entities/auction/ui/auction-payment-info.component'
import { AuctionRoute } from '@/entities/auction/ui/auction-route.component'
import { AuctionTradingSummary } from '@/entities/auction/ui/auction-trading-summary.component'
import type { AuctionShowResponse } from '@/shared/api/generated/model'
import { formatDate, formatNumber, formatPrice } from '@/shared/lib/formatters'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })
  const query = useAuctionDetailQuery(auctionUuid)

  return (
    <Container
      size='md'
      py='xl'
    >
      <Stack gap='lg'>
        <Button
          component={Link}
          to='/auctions'
          variant='subtle'
          w='fit-content'
        >
          ← К списку
        </Button>
        {query.isPending && <Text>Загрузка аукциона…</Text>}
        {query.isError && (
          <Alert
            color='red'
            title='Аукцион не найден'
          >
            Не удалось загрузить данные аукциона.
          </Alert>
        )}
        {query.data && <AuctionDetailContent auction={query.data} />}
      </Stack>
    </Container>
  )
}

function AuctionDetailContent({ auction }: { auction: AuctionShowResponse }) {
  const { main, trading } = auction
  const hideCargoPrice = trading.no_view_cargo_price === true
  const hideBetsHistory = trading.hide_bets_history === true || auction.hide_bets_history === true
  const hidePointInfo = trading.hide_points_address_and_contacts === true

  return (
    <Stack gap='lg'>
      <Group
        justify='space-between'
        align='flex-start'
        gap='md'
      >
        <div>
          <Text
            size='sm'
            c='dimmed'
          >
            Номер заявки
          </Text>
          <Title order={1}>{main.cargo_num ?? 'Аукцион без номера'}</Title>
          <Text c='dimmed'>Создан {formatDate(main.created_at)}</Text>
        </div>
        <Group gap='xs'>
          <Badge variant='light'>{getAuctionLabel(main.auc_type)}</Badge>
          <Badge
            color={trading.status === 'Auction' ? 'green' : 'gray'}
            variant='light'
          >
            {getAuctionLabel(trading.status)}
          </Badge>
        </Group>
      </Group>

      <AuctionTradingSummary
        main={main}
        trading={trading}
        hideCargoPrice={hideCargoPrice}
      />

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing='lg'
      >
        <AuctionDetailSection title='Основные данные'>
          <AuctionDataTable
            rows={[
              ['Номер заказа', main.order_uid ?? '—'],
              ['Дата груза', formatDate(main.cargo_date)],
              ['Тип аукциона', getAuctionLabel(main.auc_type)],
              ['Старт торгов', formatDate(trading.start_time)],
              ['Окончание торгов', formatDate(trading.stop_time)],
            ]}
          />
        </AuctionDetailSection>
        <AuctionOrganizerInfo
          organizer={auction.organizer}
          contacts={auction.contacts}
        />
      </SimpleGrid>

      <AuctionRoute
        routes={auction.routes}
        hidePointInfo={hidePointInfo}
      />

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing='lg'
      >
        <AuctionCargoInfo
          cargo={auction.cargo}
          hideCargoPrice={hideCargoPrice}
        />
        <AuctionPaymentInfo payment={auction.payment} />
      </SimpleGrid>

      <AuctionDetailSection title='Параметры торгов'>
        <AuctionDataTable
          rows={[
            ['Начальная цена', formatPrice(trading.price?.start)],
            ['Текущая цена', formatPrice(trading.price?.current)],
            ['Доступная цена', formatPrice(trading.price?.available)],
            ['Шаг ставки', formatPrice(trading.price?.step)],
            ['Минимальная цена', formatPrice(trading.price?.min)],
            ['Продление после ставки', formatNumber(trading.settings?.prolong_after_bet, ' мин')],
            ['Передача груза', formatNumber(trading.settings?.transmission_time_in, ' ч')],
            ['Встречные ставки', trading.allow_counter_bets ? 'Разрешены' : 'Запрещены'],
            ['Статус своей ставки', getAuctionLabel(trading.status_mobile)],
            ['Последняя ставка', formatPrice(trading.your?.last_bet)],
          ]}
        />
        <Divider my='md' />
        <Text
          fw={600}
          mb='xs'
        >
          История ставок
        </Text>
        <AuctionBetsHistory
          auctionUuid={main.order_uid ?? ''}
          hidden={hideBetsHistory}
          hidePlaces={trading.hide_places === true}
        />
      </AuctionDetailSection>
    </Stack>
  )
}
