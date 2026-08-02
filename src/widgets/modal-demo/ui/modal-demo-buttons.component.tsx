import { Button, Group, Text } from '@mantine/core'
import {
  openErrorModal,
  openModal,
  openSuccessModal,
  openStatusModal,
} from '@/app/modals/modal.actions'
import styles from './modal-demo-buttons.module.scss'

export function ModalDemoButtons() {
  return (
    <div className={styles.demo}>
      <Text
        size='sm'
        fw={600}
      >
        Демо модальных окон
      </Text>
      <Group gap='xs'>
        <Button
          size='xs'
          variant='light'
          onClick={() => openModal('demoLeft')}
        >
          Слева
        </Button>
        <Button
          size='xs'
          variant='light'
          onClick={() => openModal('demoCenter')}
        >
          По центру
        </Button>
        <Button
          size='xs'
          variant='light'
          onClick={() => openModal('demoRight')}
        >
          Справа
        </Button>
        <Button
          size='xs'
          color='green'
          variant='light'
          onClick={() => openSuccessModal()}
        >
          Success
        </Button>
        <Button
          size='xs'
          color='red'
          variant='light'
          onClick={() => openErrorModal()}
        >
          Error
        </Button>
        <Button
          size='xs'
          variant='light'
          onClick={() => openStatusModal({ variant: 'neutral', title: 'Информация' })}
        >
          Neutral
        </Button>
      </Group>
    </div>
  )
}
