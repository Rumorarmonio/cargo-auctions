import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { Link, useParams } from '@tanstack/react-router'
import { useAuctionBetsQuery } from '@/entities/auction/api/use-auction-bets.query'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail.query'
import type { AuctionShowResponse, BetItem } from '@/shared/api/generated/model'
import { normalizePhoneForHref } from '@/shared/forms/phone'
import styles from './auction-detail-page.module.scss'

const labels: Record<string, string> = {
  Request: 'Заявка',
  Up: 'Повышение',
  Down: 'Понижение',
  FixPrice: 'Фиксированная цена',
  Planning: 'Планирование',
  Auction: 'Идут торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  PerRoute: 'За рейс',
  PerKm: 'За километр',
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Leading: 'Вы лидируете',
  Losing: 'Ваша ставка перебита',
  Winner: 'Вы победили',
  NotParticipating: 'Не участвуете',
  Confirmed: 'Подтверждена',
}

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—'

const formatNumber = (value?: number | null, suffix = '') =>
  value === undefined || value === null
    ? '—'
    : `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)}${suffix}`

const formatPrice = (value?: number | null) =>
  value === undefined || value === null
    ? '—'
    : `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)} ₽`

const getLabel = (value?: string | null) => (value ? (labels[value] ?? value) : '—')

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card
      withBorder
      padding='lg'
      component='section'
    >
      <Title
        order={2}
        size='h3'
        mb='md'
      >
        {title}
      </Title>
      {children}
    </Card>
  )
}

function DataTable({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <Table
      withRowBorders={false}
      verticalSpacing='xs'
    >
      <Table.Tbody>
        {rows.map(([label, value]) => (
          <Table.Tr key={label}>
            <Table.Td className={styles.label}>{label}</Table.Td>
            <Table.Td>{value}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

type ContactLinkData = {
  name?: string | null
  phone?: string | null
  email?: string | null
}

function ContactLinks({ contact }: { contact: ContactLinkData }) {
  return (
    <>
      {contact.name ?? 'Контакт'}
      {contact.phone && (
        <>
          {' · '}
          <Anchor href={`tel:${normalizePhoneForHref(contact.phone)}`}>{contact.phone}</Anchor>
        </>
      )}
      {contact.email && (
        <>
          {' · '}
          <Anchor href={`mailto:${contact.email}`}>{contact.email}</Anchor>
        </>
      )}
    </>
  )
}

function BetsHistory({
  auctionUuid,
  hidden,
  hidePlaces,
}: {
  auctionUuid: string
  hidden: boolean
  hidePlaces: boolean
}) {
  const query = useAuctionBetsQuery(auctionUuid, !hidden)

  if (hidden) {
    return <Text c='dimmed'>История ставок скрыта организатором.</Text>
  }

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
            <BetRow
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

function BetRow({ bet, hidePlaces }: { bet: BetItem; hidePlaces: boolean }) {
  const priceWithVat = bet.price_info?.price_with_vat ?? bet.price_with_vat
  const priceNoVat = bet.price_info?.price_no_vat ?? bet.price_no_vat
  const isCanceled = Boolean(bet.cancel_reason) || bet.is_rejected === true

  return (
    <Table.Tr>
      <Table.Td>{formatDate(bet.created_at)}</Table.Td>
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
  const { main, trading, cargo, payment, organizer } = auction
  const canSetBet = trading.can_set_bet === true
  const hasBet = trading.your?.bet === true
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
          <Badge variant='light'>{getLabel(main.auc_type)}</Badge>
          <Badge
            color={trading.status === 'Auction' ? 'green' : 'gray'}
            variant='light'
          >
            {getLabel(trading.status)}
          </Badge>
        </Group>
      </Group>

      <Card
        withBorder
        padding='lg'
        className={styles.tradingSummary}
      >
        <Group
          justify='space-between'
          align='center'
          gap='md'
        >
          <div>
            <Text
              size='sm'
              c='dimmed'
            >
              Текущая цена
            </Text>
            {hideCargoPrice ? (
              <Text
                size='xl'
                fw={700}
              >
                Цена скрыта организатором
              </Text>
            ) : (
              <Text
                size='xl'
                fw={700}
              >
                {formatPrice(trading.price?.current)}
              </Text>
            )}
            <Text
              size='sm'
              c='dimmed'
            >
              {getLabel(trading.bid_measurement_type)}
            </Text>
          </div>
          {canSetBet && main.order_uid ? (
            <Button
              component={Link}
              to={`/auctions/${main.order_uid}/bet`}
            >
              {hasBet ? 'Изменить ставку' : 'Сделать ставку'}
            </Button>
          ) : (
            <Button
              disabled
              variant='light'
            >
              Ставка недоступна
            </Button>
          )}
        </Group>
        {!canSetBet && (
          <Text
            size='sm'
            c='dimmed'
            mt='sm'
          >
            Сейчас для вашей организации нельзя сделать ставку.
          </Text>
        )}
      </Card>

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing='lg'
      >
        <DetailCard title='Основные данные'>
          <DataTable
            rows={[
              ['Номер заказа', main.order_uid ?? '—'],
              ['Дата груза', formatDate(main.cargo_date)],
              ['Тип аукциона', getLabel(main.auc_type)],
              ['Старт торгов', formatDate(trading.start_time)],
              ['Окончание торгов', formatDate(trading.stop_time)],
            ]}
          />
        </DetailCard>

        <DetailCard title='Организатор'>
          <DataTable
            rows={[
              ['Организация', organizer.organization_name ?? '—'],
              ['ИНН', organizer.organization_inn ?? '—'],
              ['КПП', organizer.organization_kpp ?? '—'],
              ['Код организации', organizer.infobase_code ?? organizer.subscriber_code ?? '—'],
            ]}
          />
          {auction.contacts.length > 0 && (
            <>
              <Divider my='md' />
              <Text
                size='sm'
                fw={600}
                mb='xs'
              >
                Контакты
              </Text>
              <Stack gap='xs'>
                {auction.contacts.map((contact, index) => (
                  <Text
                    key={`${contact.uid ?? contact.phone ?? 'contact'}-${index}`}
                    size='sm'
                  >
                    <ContactLinks contact={contact} />
                  </Text>
                ))}
              </Stack>
            </>
          )}
        </DetailCard>
      </SimpleGrid>

      <DetailCard title='Маршрут'>
        <Stack gap='md'>
          {auction.routes.map((point, index) => (
            <div
              key={`${point.row_num ?? index}-${point.location?.city_name ?? 'point'}`}
              className={styles.routePoint}
            >
              <Group
                justify='space-between'
                align='flex-start'
                gap='md'
              >
                <div>
                  <Badge variant='light'>{getLabel(point.op_type)}</Badge>
                  <Text
                    fw={600}
                    mt='xs'
                  >
                    {point.location?.city_full_name ??
                      point.location?.city_name ??
                      'Место не указано'}
                  </Text>
                  <Text
                    size='sm'
                    c='dimmed'
                  >
                    {hidePointInfo
                      ? 'Адрес скрыт'
                      : (point.location?.loading_address ?? 'Адрес не указан')}
                  </Text>
                </div>
                <Text
                  size='sm'
                  c='dimmed'
                  ta='right'
                >
                  {formatDate(point.start_date)}
                  <br />
                  до {formatDate(point.end_date)}
                </Text>
              </Group>
              {hidePointInfo ? (
                <Text
                  size='sm'
                  mt='xs'
                  c='dimmed'
                >
                  Контакты скрыты
                </Text>
              ) : (
                <Text
                  size='sm'
                  mt='xs'
                >
                  {point.contact ? (
                    <>
                      {'Контакт: '}
                      <ContactLinks contact={point.contact} />
                    </>
                  ) : (
                    'Контакты не указаны'
                  )}
                </Text>
              )}
            </div>
          ))}
        </Stack>
      </DetailCard>

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing='lg'
      >
        <DetailCard title='Груз'>
          <DataTable
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
        </DetailCard>

        <DetailCard title='Оплата'>
          <DataTable
            rows={[
              ['Форма', payment.form ?? '—'],
              ['Условие', payment.condition ?? payment.condition_predefined ?? '—'],
              [
                'Отсрочка',
                payment.delay === null || payment.delay === undefined
                  ? '—'
                  : `${payment.delay} ${getLabel(payment.delay_type)}`,
              ],
              ['Предоплата', payment.prepay ?? '—'],
              ['Валюта', payment.currency_code ?? '—'],
            ]}
          />
        </DetailCard>
      </SimpleGrid>

      <DetailCard title='Параметры торгов'>
        <DataTable
          rows={[
            ['Начальная цена', formatPrice(trading.price?.start)],
            ['Текущая цена', formatPrice(trading.price?.current)],
            ['Доступная цена', formatPrice(trading.price?.available)],
            ['Шаг ставки', formatPrice(trading.price?.step)],
            ['Минимальная цена', formatPrice(trading.price?.min)],
            ['Продление после ставки', formatNumber(trading.settings?.prolong_after_bet, ' мин')],
            ['Передача груза', formatNumber(trading.settings?.transmission_time_in, ' ч')],
            ['Встречные ставки', trading.allow_counter_bets ? 'Разрешены' : 'Запрещены'],
            ['Статус своей ставки', getLabel(trading.status_mobile)],
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
        <BetsHistory
          auctionUuid={main.order_uid ?? ''}
          hidden={hideBetsHistory}
          hidePlaces={trading.hide_places === true}
        />
      </DetailCard>
    </Stack>
  )
}
