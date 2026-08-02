import { Stack, Text, Title } from '@mantine/core'

export function ModalDemoCenter() {
  return (
    <Stack gap='sm'>
      <Title order={3}>Центральная модалка</Title>
      <Text c='dimmed'>Небольшой контент для подтверждений и компактных форм.</Text>
      <Text>Анимация появления использует стандартный transition Mantine.</Text>
    </Stack>
  )
}
