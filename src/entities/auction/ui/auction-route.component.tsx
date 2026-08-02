import { Badge, Group, Stack, Text } from '@mantine/core'
import type { RoutePoint } from '@/shared/api/generated/model'
import { formatDate } from '@/shared/lib/formatters'
import { getAuctionLabel } from '@/entities/auction/model/auction-labels'
import { AuctionContactLinks } from './auction-contact-links.component'
import { AuctionDetailSection } from './auction-detail-section.component'
import styles from './auction-route.module.scss'

export function AuctionRoute({
  routes,
  hidePointInfo,
}: {
  routes: RoutePoint[]
  hidePointInfo: boolean
}) {
  return (
    <AuctionDetailSection title='Маршрут'>
      <Stack gap='md'>
        {routes.map((point, index) => (
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
                <Badge variant='light'>{getAuctionLabel(point.op_type)}</Badge>
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
                    <AuctionContactLinks contact={point.contact} />
                  </>
                ) : (
                  'Контакты не указаны'
                )}
              </Text>
            )}
          </div>
        ))}
      </Stack>
    </AuctionDetailSection>
  )
}
