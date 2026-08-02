import { useEffect } from 'react'
import { Drawer, Modal } from '@mantine/core'
import type { MantineTransition } from '@mantine/core'
import { useModalStore } from './modal.store'
import { modalDefinitions } from './modal.registry'
import { AuctionFiltersModalContent } from '@/features/auction-filters/ui/auction-filters-modal-content.component'
import { ModalDemoCenter } from '@/widgets/modal-demo/ui/modal-demo-center.component'
import { ModalDemoSide } from '@/widgets/modal-demo/ui/modal-demo-side.component'
import { StatusModal } from '@/widgets/modal-demo/ui/status-modal.component'
import type { ModalContentMap, ModalId, ModalStateById } from './modal.types'
import styles from './modals-host.module.scss'

const contentById: ModalContentMap = {
  demoLeft: ModalDemoSide,
  demoCenter: ModalDemoCenter,
  demoRight: ModalDemoSide,
  status: StatusModal,
  auctionFilters: AuctionFiltersModalContent,
}

function assertNever(value: never): never {
  throw new Error(`Неизвестный идентификатор модального окна: ${value}`)
}

function renderModalContent(id: ModalId, byId: ModalStateById, key: string) {
  switch (id) {
    case 'demoLeft':
      return <contentById.demoLeft key={key} />
    case 'demoCenter':
      return <contentById.demoCenter key={key} />
    case 'demoRight':
      return <contentById.demoRight key={key} />
    case 'status':
      return (
        <contentById.status
          key={key}
          params={byId.status?.params}
        />
      )
    case 'auctionFilters':
      return (
        <contentById.auctionFilters
          key={key}
          params={byId.auctionFilters?.params}
        />
      )
    default:
      return assertNever(id)
  }
}

export function ModalsHost() {
  const byId = useModalStore((state) => state.byId)
  const finishClosing = useModalStore((state) => state.finishClosing)
  const hasOpenModals = Object.values(byId).some((state) => state?.isOpen || state?.isClosing)

  useEffect(() => {
    if (!hasOpenModals) return

    const documentElementOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    const bodyOverflowY = document.body.style.overflowY
    const bodyPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth)

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overflowY = 'hidden'
    document.body.style.setProperty('--modal-scrollbar-width', `${scrollbarWidth}px`)
    document.body.style.paddingRight = `calc(${bodyPaddingRight || '0px'} + var(--modal-scrollbar-width))`

    return () => {
      document.documentElement.style.overflow = documentElementOverflow
      document.body.style.overflow = bodyOverflow
      document.body.style.overflowY = bodyOverflowY
      document.body.style.paddingRight = bodyPaddingRight
      document.body.style.removeProperty('--modal-scrollbar-width')
    }
  }, [hasOpenModals])

  return (
    <>
      {modalDefinitions.map((definition) => {
        const state = byId[definition.id]

        const content = renderModalContent(
          definition.id,
          byId,
          `${definition.id}-${JSON.stringify(state?.params ?? null)}`,
        )
        const closeSequence = state?.closeSequence
        const transition: MantineTransition =
          definition.kind === 'modal'
            ? 'pop'
            : definition.position === 'left'
              ? 'slide-right'
              : 'slide-left'
        const commonProps = {
          opened: state?.isOpen ?? false,
          onClose: () => useModalStore.getState().closeModal(definition.id),
          onExitTransitionEnd: () => {
            if (closeSequence !== undefined) {
              finishClosing(definition.id, closeSequence)
            }
          },
          lockScroll: true,
          transitionProps: {
            duration: 320,
            transition,
          },
        }

        if (definition.kind === 'drawer') {
          return (
            <Drawer
              key={definition.id}
              {...commonProps}
              position={definition.position === 'left' ? 'left' : 'right'}
              title={'title' in definition ? definition.title : undefined}
              size={definition.width}
              classNames={
                'mobileFullWidth' in definition && definition.mobileFullWidth
                  ? { content: styles.mobileFullWidthDrawer }
                  : undefined
              }
              overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
              removeScrollProps={{ removeScrollBar: false }}
            >
              {content}
            </Drawer>
          )
        }

        return (
          <Modal
            key={definition.id}
            {...commonProps}
            centered
            title={'title' in definition ? (definition.title as string) : undefined}
            size={definition.width}
            overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
            removeScrollProps={{ removeScrollBar: false }}
          >
            {content}
          </Modal>
        )
      })}
    </>
  )
}
