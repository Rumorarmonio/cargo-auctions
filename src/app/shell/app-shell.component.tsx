import type { ReactNode } from 'react'
import {
  ActionIcon,
  AppShell as MantineAppShell,
  Container,
  Group,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { Link, useLocation } from '@tanstack/react-router'
import styles from './app-shell.module.scss'
import { ModalDemoButtons } from '@/widgets/modal-demo/ui/modal-demo-buttons.component'
import { ModalsHost } from '@/app/modals/modals-host.component'

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
  }

  return (
    <MantineAppShell header={{ height: 64 }}>
      <MantineAppShell.Header className={styles.headerBar}>
        <Container
          size='xl'
          className={styles.header}
        >
          <Group
            justify='space-between'
            w='100%'
          >
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
            <Group gap='sm'>
              <Text
                c='dimmed'
                size='sm'
                className={styles.subtitle}
              >
                Тестовый аукционный кабинет
              </Text>
              <Tooltip
                label={
                  computedColorScheme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'
                }
              >
                <ActionIcon
                  variant='default'
                  size='lg'
                  onClick={toggleColorScheme}
                  aria-label={
                    computedColorScheme === 'light'
                      ? 'Включить тёмную тему'
                      : 'Включить светлую тему'
                  }
                  aria-pressed={computedColorScheme === 'dark'}
                >
                  {computedColorScheme === 'light' ? '☾' : '☼'}
                </ActionIcon>
              </Tooltip>
            </Group>
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
