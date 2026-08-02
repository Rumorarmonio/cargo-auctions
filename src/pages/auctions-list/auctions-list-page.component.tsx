import {
  Alert,
  Button,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { auctionDetailQueryOptions } from '@/entities/auction/api/use-auction-detail.query'
import { useAuctionsListQuery } from '@/entities/auction/api/use-auctions-list.query'
import {
  type AuctionsListSearch,
  toAuctionsListRequest,
} from '@/entities/auction/model/auctions-list-search'
import { AuctionCard } from '@/entities/auction/ui/auction-card.component'
import { AuctionFiltersForm } from '@/features/auction-filters/ui/auction-filters-form.component'
import type { AuctionListFilters } from '@/features/auction-filters/model/types'
import { closeModal, openModal } from '@/app/modals/modal.actions'
import { useModalStore } from '@/app/modals/modal.store'
import styles from './auctions-list-page.module.scss'

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
  const query = useAuctionsListQuery(toAuctionsListRequest(search))
  const mobileFiltersOpened = useModalStore((state) => Boolean(state.byId.auctionFilters?.isOpen))
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
        <div className={styles.desktopFilters}>
          <AuctionFiltersForm
            key={JSON.stringify(search)}
            initialFilters={getInitialFilters(search)}
            onApply={updateSearch}
          />
        </div>
        <div className={styles.mobileFiltersToolbar}>
          <Button
            variant='light'
            fullWidth
            onClick={() =>
              openModal('auctionFilters', {
                initialFilters: getInitialFilters(search),
                onApply: (filters) => {
                  updateSearch(filters)
                  closeModal('auctionFilters')
                },
              })
            }
          >
            Фильтры{mobileFiltersOpened ? ' открыты' : ''}
          </Button>
        </div>
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
                  onIntent={(uuid) =>
                    void queryClient.prefetchQuery(auctionDetailQueryOptions(uuid))
                  }
                />
              ))}
            </SimpleGrid>
            {(meta?.last_page ?? 1) > 1 && (
              <Group justify='center'>
                <Pagination
                  total={meta?.last_page ?? 1}
                  value={meta?.current_page ?? search.page}
                  onChange={(page) =>
                    void navigate({ search: (previous) => ({ ...previous, page }) })
                  }
                />
              </Group>
            )}
          </>
        )}
      </Stack>
    </Container>
  )
}
