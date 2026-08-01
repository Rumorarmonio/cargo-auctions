import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { AuctionListItem } from '@/shared/api/generated/model'
import styles from './auction-card.module.scss'

const labels: Record<string, string> = {
  Request: 'Заявка',
  Up: 'Повышение',
  Down: 'Понижение',
  FixPrice: 'Фиксированная цена',
  Planning: 'Планирование',
  Auction: 'Идут торги',
  Finished: 'Завершён',
  Leading: 'Вы лидируете',
  Losing: 'Ваша ставка перебита',
  Winner: 'Вы победили',
  NotParticipating: 'Не участвуете',
}

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(value)) : '—'

const formatPrice = (value?: number) =>
  value === undefined ? 'Цена скрыта' : `${new Intl.NumberFormat('ru-RU').format(value)} ₽`

type AuctionCardProps = {
  auction: AuctionListItem
  onIntent: (auctionUuid: string) => void
}

export function AuctionCard({ auction, onIntent }: AuctionCardProps) {
  const uuid = auction.main?.order_uid
  if (!uuid) return null

  const route = auction.route
  const trading = auction.trading
  const cargo = auction.cargo
  const canSetBet = trading?.can_set_bet === true
  const hasBet = trading?.your?.bet === true

  return (
    <Card
      className={styles.card}
      component='article'
      withBorder
      padding='lg'
      onMouseEnter={() => onIntent(uuid)}
      onFocus={() => onIntent(uuid)}
    >
      <Stack gap='md'>
        <Group
          justify='space-between'
          align='flex-start'
          wrap='nowrap'
        >
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Номер заявки
            </Text>
            <Text fw={700}>{auction.main?.cargo_num ?? 'Без номера'}</Text>
          </div>
          <Group
            gap='xs'
            justify='flex-end'
          >
            <Badge variant='light'>
              {labels[auction.main?.auc_type ?? ''] ?? auction.main?.auc_type}
            </Badge>
            <Badge
              color={trading?.status === 'Auction' ? 'green' : 'gray'}
              variant='light'
            >
              {labels[trading?.status ?? ''] ?? trading?.status ?? 'Статус неизвестен'}
            </Badge>
          </Group>
        </Group>

        <div className={styles.route}>
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Погрузка
            </Text>
            <Text fw={600}>{route?.load?.city ?? '—'}</Text>
            <Text
              size='sm'
              c='dimmed'
            >
              {formatDate(route?.load?.date)}
            </Text>
          </div>
          <Text
            c='dimmed'
            aria-hidden
          >
            →
          </Text>
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Выгрузка
            </Text>
            <Text fw={600}>{route?.unload?.city ?? '—'}</Text>
            <Text
              size='sm'
              c='dimmed'
            >
              {formatDate(route?.unload?.date)}
            </Text>
          </div>
        </div>

        <Group gap='xl'>
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Груз
            </Text>
            <Text>{cargo?.name ?? '—'}</Text>
          </div>
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Вес / объём
            </Text>
            <Text>
              {cargo?.weight ?? '—'} т / {cargo?.volume ?? '—'} м³
            </Text>
          </div>
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Кузов
            </Text>
            <Text>{cargo?.body_type ?? '—'}</Text>
          </div>
        </Group>

        <Group
          justify='space-between'
          align='flex-end'
        >
          <div>
            <Text
              size='xs'
              c='dimmed'
            >
              Текущая цена
            </Text>
            <Text
              size='xl'
              fw={700}
            >
              {formatPrice(trading?.price?.current)}
            </Text>
            {auction.main?.price_per_km && (
              <Text
                size='xs'
                c='dimmed'
              >
                {formatPrice(auction.main.price_per_km)} / км
              </Text>
            )}
          </div>
          <Stack
            gap='xs'
            align='flex-end'
          >
            {trading?.status_mobile && (
              <Text
                size='sm'
                c='blue'
              >
                {labels[trading.status_mobile] ?? trading.status_mobile}
              </Text>
            )}
            <Button
              component={Link}
              to={`/auctions/${uuid}`}
              variant={canSetBet ? 'filled' : 'light'}
            >
              {canSetBet ? (hasBet ? 'Изменить ставку' : 'Сделать ставку') : 'Смотреть аукцион'}
            </Button>
          </Stack>
        </Group>
      </Stack>
    </Card>
  )
}
