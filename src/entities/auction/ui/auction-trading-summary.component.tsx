import { Button, Card, Group, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { AuctionShowMain, AuctionShowTrading } from '@/shared/api/generated/model'
import { formatPrice } from '@/shared/lib/formatters'
import { getAuctionLabel } from '@/entities/auction/model/auction-labels'
import styles from './auction-trading-summary.module.scss'

export function AuctionTradingSummary({
  main,
  trading,
  hideCargoPrice,
}: {
  main: AuctionShowMain
  trading: AuctionShowTrading
  hideCargoPrice: boolean
}) {
  const canSetBet = trading.can_set_bet === true
  const hasBet = trading.your?.bet === true

  return (
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
            {getAuctionLabel(trading.bid_measurement_type)}
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
  )
}
