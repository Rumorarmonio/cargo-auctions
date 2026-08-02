import { useModalStore } from './modal.store'
import type { ModalId, ModalParamsFor, StatusModalParams } from './modal.types'

export function openModal<T extends ModalId>(id: T, params?: ModalParamsFor<T>) {
  useModalStore.getState().openModal(id, params)
}

export function closeModal(id: ModalId) {
  useModalStore.getState().closeModal(id)
}

export function openStatusModal(params: StatusModalParams) {
  openModal('status', params)
}

export function openSuccessModal(message = 'Операция выполнена успешно.') {
  openStatusModal({ variant: 'success', message })
}

export function openErrorModal(message = 'Не удалось выполнить операцию.') {
  openStatusModal({ variant: 'error', message })
}
