import type { ModalDefinition } from './modal.types'

const sideDrawerWidth = 'min(100% - 2rem, 42rem)'

export const modalDefinitions = [
  {
    id: 'demoLeft',
    kind: 'drawer',
    position: 'left',
    width: sideDrawerWidth,
    mobileFullWidth: true,
  },
  {
    id: 'demoCenter',
    kind: 'modal',
    width: 'min(100% - 2rem, 32rem)',
  },
  {
    id: 'demoRight',
    kind: 'drawer',
    position: 'right',
    width: sideDrawerWidth,
    mobileFullWidth: true,
  },
  {
    id: 'status',
    kind: 'modal',
    width: 'min(100% - 2rem, 28rem)',
  },
  {
    id: 'auctionFilters',
    kind: 'drawer',
    position: 'right',
    title: 'Фильтры аукционов',
    width: 'min(100% - 1rem, 32rem)',
    mobileFullWidth: true,
  },
] as const satisfies readonly ModalDefinition[]
