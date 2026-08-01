import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuctionsListQuery } from '@/entities/auction/api/use-auctions-list.query'
import { auctionDetailQueryOptions } from '@/entities/auction/api/use-auction-detail.query'
import { AuctionCard } from '@/entities/auction/ui/auction-card.component'
import {
  type AuctionsListSearch,
  toAuctionsListRequest,
} from '@/entities/auction/model/auctions-list-search'
import styles from './auctions-list-page.module.scss'

const cityOptions = ['Новосибирск', 'Омск', 'Томск', 'Кемерово'].map((city) => ({
  value: city,
  label: city,
}))
const statusOptions = [
  { value: '2', label: 'Идут торги' },
  { value: '1', label: 'Планирование' },
  { value: '6', label: 'Завершён' },
]
const typeOptions = [
  { value: 'Request', label: 'Заявка' },
  { value: 'Up', label: 'Повышение' },
  { value: 'Down', label: 'Понижение' },
  { value: 'FixPrice', label: 'Фиксированная цена' },
]
const dropdownTransition = {
  transition: {
    common: { transformOrigin: 'top' },
    in: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
    out: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    transitionProperty: 'clip-path, opacity',
  },
  duration: 300,
} as const
const selectComboboxProps = { transitionProps: dropdownTransition }

type AuctionListFilters = {
  cargo_num: string
  status: string | undefined
  statuses: string[]
  auc_type: string | undefined
  auc_types: string[]
  load_city: string | undefined
  unload_city: string | undefined
  load_date_from: string
  load_date_to: string
  is_available: boolean
  is_bidder: boolean
  current_price_from: number | undefined
  current_price_to: number | undefined
}

const getInitialFilters = (search: AuctionsListSearch): AuctionListFilters => ({
  cargo_num: search.cargo_num ?? '',
  status: search.statuses?.[0],
  statuses: search.statuses ?? [],
  auc_type: search.auc_type?.[0],
  auc_types: search.auc_type ?? [],
  load_city: search.load_city,
  unload_city: search.unload_city,
  load_date_from: search.load_date_from ?? '',
  load_date_to: search.load_date_to ?? '',
  is_available: search.is_available ?? false,
  is_bidder: search.is_bidder ?? false,
  current_price_from: search.current_price_from,
  current_price_to: search.current_price_to,
})

export function AuctionsListPage() {
  const search = useSearch({ from: '/auctions' })
  const navigate = useNavigate({ from: '/auctions' })
  const queryClient = useQueryClient()

  const request = toAuctionsListRequest(search)
  const query = useAuctionsListQuery(request)
  const response = query.data
  const items = response?.data ?? []
  const meta = response?.meta

  const updateSearch = (nextFilters: AuctionListFilters) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        page: 1,
        per_page: search.per_page,
        cargo_num: nextFilters.cargo_num || undefined,
        statuses: nextFilters.statuses.length > 0 ? nextFilters.statuses : undefined,
        auc_type: nextFilters.auc_types.length > 0 ? nextFilters.auc_types : undefined,
        load_city: nextFilters.load_city,
        unload_city: nextFilters.unload_city,
        load_date_from: nextFilters.load_date_from || undefined,
        load_date_to: nextFilters.load_date_to || undefined,
        is_available: nextFilters.is_available || undefined,
        is_bidder: nextFilters.is_bidder || undefined,
        current_price_from: nextFilters.current_price_from,
        current_price_to: nextFilters.current_price_to,
      }),
    })
  }

  const prefetchDetail = (auctionUuid: string) => {
    void queryClient.prefetchQuery(auctionDetailQueryOptions(auctionUuid))
  }

  const changePage = (page: number) => {
    void navigate({ search: (previous) => ({ ...previous, page }) })
  }

  return (
    <Container
      size='xl'
      py='xl'
    >
      <Stack gap='xl'>
        <div>
          <Title order={1}>Аукционы</Title>
          <Text c='dimmed'>Найдите подходящую перевозку и сделайте ставку</Text>
        </div>

        <AuctionFiltersForm
          key={JSON.stringify(search)}
          initialFilters={getInitialFilters(search)}
          onApply={updateSearch}
        />

        {query.isPending && (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Skeleton height={300} />
            <Skeleton height={300} />
          </SimpleGrid>
        )}
        {query.isError && (
          <Alert
            color='red'
            title='Не удалось загрузить аукционы'
          >
            <Group justify='space-between'>
              <Text>Попробуйте повторить запрос.</Text>
              <Button
                variant='light'
                onClick={() => void query.refetch()}
              >
                Повторить
              </Button>
            </Group>
          </Alert>
        )}
        {!query.isPending && !query.isError && items.length === 0 && (
          <div className={styles.empty}>
            <Title order={3}>Аукционы не найдены</Title>
            <Text c='dimmed'>Измените фильтры или попробуйте позже.</Text>
          </div>
        )}
        {!query.isPending && !query.isError && items.length > 0 && (
          <>
            <Group justify='space-between'>
              <Text c='dimmed'>Найдено: {meta?.total ?? items.length}</Text>
              {query.isFetching && (
                <Text
                  size='sm'
                  c='dimmed'
                >
                  Обновляем…
                </Text>
              )}
            </Group>
            <SimpleGrid
              key={search.page}
              cols={{ base: 1, md: 2 }}
              spacing='lg'
              className={styles.auctionGrid}
            >
              {items.map((auction) => (
                <AuctionCard
                  key={auction.main?.order_uid}
                  auction={auction}
                  onIntent={prefetchDetail}
                />
              ))}
            </SimpleGrid>
            {(meta?.last_page ?? 1) > 1 && (
              <Group justify='center'>
                <Pagination
                  total={meta?.last_page ?? 1}
                  value={meta?.current_page ?? search.page}
                  onChange={changePage}
                />
              </Group>
            )}
          </>
        )}
      </Stack>
    </Container>
  )
}

function AuctionFiltersForm({
  initialFilters,
  onApply,
}: {
  initialFilters: AuctionListFilters
  onApply: (filters: AuctionListFilters) => void
}) {
  const [filters, setFilters] = useState(initialFilters)
  const update = (next: Partial<AuctionListFilters>) =>
    setFilters((current) => ({ ...current, ...next }))

  return (
    <form
      className={styles.filters}
      onSubmit={(event) => {
        event.preventDefault()
        onApply(filters)
      }}
    >
      <TextInput
        label='Номер заявки'
        placeholder='Например, CA-2026-001'
        value={filters.cargo_num}
        onChange={(event) => update({ cargo_num: event.currentTarget.value })}
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Статус торгов'
        placeholder='Все статусы'
        clearable
        data={statusOptions}
        value={filters.status}
        onChange={(value) =>
          update({
            status: value ?? undefined,
            statuses: value ? [value] : [],
          })
        }
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Тип аукциона'
        placeholder='Все типы'
        clearable
        data={typeOptions}
        value={filters.auc_type}
        onChange={(value) =>
          update({
            auc_type: value ?? undefined,
            auc_types: value ? [value] : [],
          })
        }
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Погрузка'
        placeholder='Город'
        clearable
        data={cityOptions}
        value={filters.load_city}
        onChange={(value) => update({ load_city: value ?? undefined })}
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Выгрузка'
        placeholder='Город'
        clearable
        data={cityOptions}
        value={filters.unload_city}
        onChange={(value) => update({ unload_city: value ?? undefined })}
      />
      <DateInput
        popoverProps={{ transitionProps: dropdownTransition }}
        valueFormat='DD.MM.YYYY'
        label='Погрузка от'
        placeholder='Выберите дату'
        value={filters.load_date_from || null}
        onChange={(value) => update({ load_date_from: value ?? '' })}
      />
      <DateInput
        popoverProps={{ transitionProps: dropdownTransition }}
        valueFormat='DD.MM.YYYY'
        label='Погрузка до'
        placeholder='Выберите дату'
        value={filters.load_date_to || null}
        onChange={(value) => update({ load_date_to: value ?? '' })}
      />
      <NumberInput
        label='Цена от'
        min={0}
        value={filters.current_price_from ?? ''}
        onChange={(value) =>
          update({ current_price_from: typeof value === 'number' ? value : undefined })
        }
      />
      <NumberInput
        label='Цена до'
        min={0}
        value={filters.current_price_to ?? ''}
        onChange={(value) =>
          update({ current_price_to: typeof value === 'number' ? value : undefined })
        }
      />
      <Group
        align='center'
        justify='end'
        gap='lg'
      >
        <Checkbox
          label='Доступны для ставки'
          checked={filters.is_available}
          onChange={(event) => update({ is_available: event.currentTarget.checked })}
        />
        <Checkbox
          label='Я участвую'
          checked={filters.is_bidder}
          onChange={(event) => update({ is_bidder: event.currentTarget.checked })}
        />
        <Button type='submit'>Применить</Button>
      </Group>
    </form>
  )
}
