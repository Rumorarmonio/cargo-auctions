import type { ReactNode } from 'react'
import { Card, Title } from '@mantine/core'

export function AuctionDetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card
      withBorder
      padding='lg'
      component='section'
    >
      <Title
        order={2}
        size='h3'
        mb='md'
      >
        {title}
      </Title>
      {children}
    </Card>
  )
}
