import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from '@tanstack/react-router'

export function AuctionBetPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bet' })

  return (
    <Container
      size='md'
      py='xl'
    >
      <Stack gap='lg'>
        <Button
          component={Link}
          to={`/auctions/${auctionUuid}`}
          variant='subtle'
          w='fit-content'
        >
          ← К аукциону
        </Button>
        <Title order={1}>Ставка на аукцион</Title>
        <Alert title='Форма ставки готовится'>
          <Text>Установка и изменение ставки будут добавлены следующим шагом.</Text>
        </Alert>
      </Stack>
    </Container>
  )
}
