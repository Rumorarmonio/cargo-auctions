import { Alert, Stack, Text } from '@mantine/core'
import type { StatusModalParams } from '@/app/modals/modal.types'

export function StatusModal({ params }: { params?: unknown }) {
  const status = params as StatusModalParams | undefined
  const color =
    status?.variant === 'error' ? 'red' : status?.variant === 'success' ? 'green' : 'blue'

  return (
    <Stack>
      <Alert
        color={color}
        title={status?.title ?? 'Информация'}
      >
        <Text>{status?.message ?? 'Это демонстрационное статусное сообщение.'}</Text>
      </Alert>
    </Stack>
  )
}
