import { create } from 'zustand'

type UiStore = {
  mobileFiltersOpened: boolean
  setMobileFiltersOpened: (opened: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  mobileFiltersOpened: false,
  setMobileFiltersOpened: (opened) => set({ mobileFiltersOpened: opened }),
}))
