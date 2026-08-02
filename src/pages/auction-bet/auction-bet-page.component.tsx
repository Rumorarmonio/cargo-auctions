import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAuctionDetailQuery } from '@/entities/auction/api/use-auction-detail.query'
import {
  AuctionBetRequestError,
  useSetBetMutation,
} from '@/features/auction-bet/api/use-set-bet.mutation'
import { createAuctionBetSchema } from '@/features/auction-bet/model/schemas'

type BetFormValues = {
  price: number
}

export function AuctionBetPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bet' })
  const query = useAuctionDetailQuery(auctionUuid)
  const tradingPrice = query.data?.trading.price
  const schema = createAuctionBetSchema(tradingPrice?.min, tradingPrice?.max, tradingPrice?.step)
  const form = useForm<BetFormValues>({ defaultValues: { price: undefined } })
  const initializedAuctionUuid = useRef<string | null>(null)

  useEffect(() => {
    if (!tradingPrice || initializedAuctionUuid.current === auctionUuid) return
    form.reset({ price: tradingPrice.available ?? tradingPrice.current ?? undefined })
    initializedAuctionUuid.current = auctionUuid
  }, [auctionUuid, form, tradingPrice])

  const mutation = useSetBetMutation(auctionUuid)

  const onMutationSuccess = () => {
    notifications.show({
      title: 'Ставка установлена',
      message: 'Данные аукциона обновлены.',
      color: 'green',
    })
  }

  const onMutationError = (error: Error) => {
    notifications.show({
      title:
        error instanceof AuctionBetRequestError && error.status === 422
          ? 'Ошибка валидации'
          : 'Ошибка ставки',
      message: error.message,
      color: 'red',
    })
  }

  const onSubmit = form.handleSubmit((values) => {
    const result = schema.safeParse(values)
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'price') {
          form.setError('price', { type: issue.code, message: issue.message })
        }
      })
      return
    }

    form.clearErrors('price')
    mutation.mutate(result.data, { onSuccess: onMutationSuccess, onError: onMutationError })
  })

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
        {query.isPending && <Text>Загрузка аукциона…</Text>}
        {query.isError && (
          <Alert
            color='red'
            title='Аукцион не найден'
          >
            Не удалось загрузить данные аукциона.
          </Alert>
        )}
        {query.data && !query.data.trading.can_set_bet && (
          <Alert
            color='yellow'
            title='Ставка недоступна'
          >
            Для этого аукциона установка ставки недоступна.
          </Alert>
        )}
        {query.data?.trading.can_set_bet && tradingPrice && (
          <Card
            withBorder
            padding='lg'
            component='section'
          >
            <Stack gap='md'>
              <div>
                <Title order={1}>Ставка на аукцион</Title>
                <Text
                  c='dimmed'
                  mt='xs'
                >
                  Укажите цену с учётом ограничений аукциона.
                </Text>
              </div>
              <form onSubmit={onSubmit}>
                <Stack gap='md'>
                  <Controller
                    control={form.control}
                    name='price'
                    render={({ field, fieldState }) => (
                      <NumberInput
                        {...field}
                        label='Цена ставки'
                        description={`Минимум: ${tradingPrice.min ?? '—'} · Максимум: ${tradingPrice.max ?? '—'} · Шаг: ${tradingPrice.step ?? '—'}`}
                        clampBehavior='none'
                        min={tradingPrice.min ?? undefined}
                        max={tradingPrice.max ?? undefined}
                        step={tradingPrice.step ?? undefined}
                        error={fieldState.error?.message}
                        decimalScale={2}
                        allowDecimal
                        thousandSeparator=' '
                        onChange={(value) =>
                          field.onChange(typeof value === 'number' ? value : Number.NaN)
                        }
                      />
                    )}
                  />
                  <Group justify='flex-end'>
                    <Button
                      type='submit'
                      loading={mutation.isPending}
                    >
                      Установить ставку
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
