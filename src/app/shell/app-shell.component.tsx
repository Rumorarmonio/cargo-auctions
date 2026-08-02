import type { ReactNode } from 'react'
import { AppShell as MantineAppShell, Container, Group, Text, Title } from '@mantine/core'
import { Link, useLocation } from '@tanstack/react-router'
import styles from './app-shell.module.scss'
import { ModalDemoButtons } from '@/widgets/modal-demo/ui/modal-demo-buttons.component'
import { ModalsHost } from '@/app/modals/modals-host.component'

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <MantineAppShell header={{ height: 64 }}>
      <MantineAppShell.Header className={styles.headerBar}>
        <Container
          size='xl'
          className={styles.header}
        >
          <Group justify='space-between'>
            <Title
              order={3}
              c='inherit'
              td='none'
              renderRoot={(props) => (
                <Link
                  {...props}
                  to='/'
                />
              )}
            >
              Cargo Auctions
            </Title>
            <Text
              c='dimmed'
              size='sm'
            >
              Тестовый аукционный кабинет
            </Text>
          </Group>
        </Container>
        {/*<ModalDemoButtons />*/}
      </MantineAppShell.Header>
      <MantineAppShell.Main className={styles.main}>
        <div
          key={location.pathname}
          className={styles.content}
        >
          {children}
        </div>
      </MantineAppShell.Main>
      <ModalsHost />
    </MantineAppShell>
  )
}
