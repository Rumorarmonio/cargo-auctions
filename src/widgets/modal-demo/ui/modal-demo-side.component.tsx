import { Stack, Text, Title } from '@mantine/core'

export function ModalDemoSide() {
  return (
    <Stack gap='sm'>
      <Title order={3}>Боковая модалка</Title>
      <Text c='dimmed'>Drawer выезжает сбоку, затем возвращается обратно при закрытии.</Text>
      <Text>Такой вариант подходит для фильтров и дополнительных действий.</Text>
    </Stack>
  )
}
