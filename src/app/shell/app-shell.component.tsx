import type { ReactNode } from 'react';
import { AppShell as MantineAppShell, Container, Group, Text, Title } from '@mantine/core';
import styles from './app-shell.module.scss';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MantineAppShell header={{ height: 64 }}>
      <MantineAppShell.Header>
        <Container size="xl" className={styles.header}>
          <Group justify="space-between">
            <Title order={3}>Cargo Auctions</Title>
            <Text c="dimmed" size="sm">Тестовый аукционный кабинет</Text>
          </Group>
        </Container>
      </MantineAppShell.Header>
      <MantineAppShell.Main>
        <Container size="xl" py="xl">{children}</Container>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
