import { create } from 'zustand'
import type { ModalId, ModalParams, ModalParamsFor } from './modal.types'

type ModalState = {
  isOpen: boolean
  isClosing: boolean
  closeSequence: number
  params?: ModalParams
}

type ModalStore = {
  byId: Partial<Record<ModalId, ModalState>>
  openModal: <T extends ModalId>(id: T, params?: ModalParamsFor<T>) => void
  closeModal: (id: ModalId) => void
  finishClosing: (id: ModalId, closeSequence: number) => void
  closeAllModals: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  byId: {},
  openModal: (id, params) =>
    set((state) => ({
      byId: {
        ...state.byId,
        [id]: {
          isOpen: true,
          isClosing: false,
          closeSequence: state.byId[id]?.closeSequence ?? 0,
          params,
        },
      },
    })),
  closeModal: (id) =>
    set((state) => {
      const modal = state.byId[id]
      if (!modal || !modal.isOpen || modal.isClosing) return state

      return {
        byId: {
          ...state.byId,
          [id]: {
            ...modal,
            isOpen: false,
            isClosing: true,
            closeSequence: modal.closeSequence + 1,
          },
        },
      }
    }),
  finishClosing: (id, closeSequence) =>
    set((state) => {
      const modal = state.byId[id]
      if (!modal || !modal.isClosing || modal.closeSequence !== closeSequence) {
        return state
      }

      const byId = { ...state.byId }
      delete byId[id]
      return { byId }
    }),
  closeAllModals: () =>
    set((state) => ({
      byId: Object.fromEntries(
        Object.entries(state.byId).map(([id, modal]) => [
          id,
          modal?.isOpen
            ? {
                ...modal,
                isOpen: false,
                isClosing: true,
                closeSequence: modal.closeSequence + 1,
              }
            : modal,
        ]),
      ) as Partial<Record<ModalId, ModalState>>,
    })),
}))

export function getModalParams<T extends ModalId>(id: T): ModalParamsFor<T> | undefined {
  return useModalStore.getState().byId[id]?.params as ModalParamsFor<T> | undefined
}

export type { ModalParams }
