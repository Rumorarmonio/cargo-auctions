import { Stack, Text, Title } from '@mantine/core'

export function ModalDemoSide({ params }: { params?: unknown }) {
  const side = (params as { side?: string } | undefined)?.side
  return (
    <Stack gap='sm'>
      <Title order={3}>{side === 'left' ? 'Левая' : 'Боковая'} модалка</Title>
      <Text c='dimmed'>Drawer выезжает сбоку, затем возвращается обратно при закрытии.</Text>
      <Text>Такой вариант подходит для фильтров и дополнительных действий.</Text>
    </Stack>
  )
}
