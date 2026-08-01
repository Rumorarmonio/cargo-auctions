import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from '@tanstack/react-router'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail.query'

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
        {query.data && (
          <>
            <Title order={1}>{query.data.main.cargo_num}</Title>
            <Text c='dimmed'>Детальная страница будет расширена на следующем этапе.</Text>
          </>
        )}
      </Stack>
    </Container>
  )
}
