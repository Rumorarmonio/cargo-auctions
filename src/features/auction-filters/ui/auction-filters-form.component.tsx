import { useEffect, useState } from 'react'
import { Button, Checkbox, Group, NumberInput, Select, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import type { AuctionListFilters } from '../model/types'
import styles from './auction-filters-form.module.scss'

const cityOptions = ['Новосибирск', 'Омск', 'Томск', 'Кемерово'].map((city) => ({
  value: city,
  label: city,
}))
const statusOptions = [
  { value: '2', label: 'Идут торги' },
  { value: '1', label: 'Планирование' },
  { value: '6', label: 'Завершён' },
]
const typeOptions = [
  { value: 'Request', label: 'Заявка' },
  { value: 'Up', label: 'Повышение' },
  { value: 'Down', label: 'Понижение' },
  { value: 'FixPrice', label: 'Фиксированная цена' },
]
const dropdownTransition = {
  transition: {
    common: { transformOrigin: 'top' },
    in: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
    out: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    transitionProperty: 'clip-path, opacity',
  },
  duration: 300,
} as const
const selectComboboxProps = { transitionProps: dropdownTransition }

const emptyFilters: AuctionListFilters = {
  cargo_num: '',
  status: undefined,
  statuses: [],
  auc_type: undefined,
  auc_types: [],
  load_city: undefined,
  unload_city: undefined,
  load_date_from: '',
  load_date_to: '',
  is_available: false,
  is_bidder: false,
  current_price_from: undefined,
  current_price_to: undefined,
}

export function AuctionFiltersForm({
  initialFilters,
  onApply,
  modalId,
  params,
}: {
  initialFilters?: AuctionListFilters
  onApply?: (filters: AuctionListFilters) => void
  modalId?: string
  params?: unknown
}) {
  const modalParams =
    (params as { initialFilters?: AuctionListFilters; onApply?: typeof onApply } | undefined) ?? {}
  const [filters, setFilters] = useState(
    initialFilters ?? modalParams.initialFilters ?? emptyFilters,
  )

  useEffect(() => {
    setFilters(initialFilters ?? modalParams.initialFilters ?? emptyFilters)
  }, [initialFilters, modalParams.initialFilters])

  const apply = onApply ?? modalParams.onApply
  const update = (next: Partial<AuctionListFilters>) =>
    setFilters((current) => ({ ...current, ...next }))

  return (
    <form
      className={styles.filters}
      data-modal-id={modalId}
      onSubmit={(event) => {
        event.preventDefault()
        apply?.(filters)
      }}
    >
      <TextInput
        label='Номер заявки'
        placeholder='Например, CA-2026-001'
        value={filters.cargo_num}
        onChange={(event) => update({ cargo_num: event.currentTarget.value })}
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Статус торгов'
        placeholder='Все статусы'
        clearable
        data={statusOptions}
        value={filters.status}
        onChange={(value) => update({ status: value ?? undefined, statuses: value ? [value] : [] })}
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Тип аукциона'
        placeholder='Все типы'
        clearable
        data={typeOptions}
        value={filters.auc_type}
        onChange={(value) =>
          update({ auc_type: value ?? undefined, auc_types: value ? [value] : [] })
        }
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Погрузка'
        placeholder='Город'
        clearable
        data={cityOptions}
        value={filters.load_city}
        onChange={(value) => update({ load_city: value ?? undefined })}
      />
      <Select
        comboboxProps={selectComboboxProps}
        label='Выгрузка'
        placeholder='Город'
        clearable
        data={cityOptions}
        value={filters.unload_city}
        onChange={(value) => update({ unload_city: value ?? undefined })}
      />
      <DateInput
        popoverProps={{ transitionProps: dropdownTransition }}
        valueFormat='DD.MM.YYYY'
        label='Погрузка от'
        placeholder='Выберите дату'
        value={filters.load_date_from || null}
        onChange={(value) => update({ load_date_from: value ?? '' })}
      />
      <DateInput
        popoverProps={{ transitionProps: dropdownTransition }}
        valueFormat='DD.MM.YYYY'
        label='Погрузка до'
        placeholder='Выберите дату'
        value={filters.load_date_to || null}
        onChange={(value) => update({ load_date_to: value ?? '' })}
      />
      <NumberInput
        label='Цена от'
        min={0}
        value={filters.current_price_from ?? ''}
        onChange={(value) =>
          update({ current_price_from: typeof value === 'number' ? value : undefined })
        }
      />
      <NumberInput
        label='Цена до'
        min={0}
        value={filters.current_price_to ?? ''}
        onChange={(value) =>
          update({ current_price_to: typeof value === 'number' ? value : undefined })
        }
      />
      <Group
        align='center'
        justify='end'
        gap='lg'
        wrap='wrap'
      >
        <Checkbox
          label='Доступны для ставки'
          checked={filters.is_available}
          onChange={(event) => update({ is_available: event.currentTarget.checked })}
        />
        <Checkbox
          label='Я участвую'
          checked={filters.is_bidder}
          onChange={(event) => update({ is_bidder: event.currentTarget.checked })}
        />
        <Button
          type='button'
          variant='subtle'
          onClick={() => {
            const resetFilters = emptyFilters
            setFilters(resetFilters)
            apply?.(resetFilters)
          }}
        >
          Сбросить
        </Button>
        <Button type='submit'>Применить</Button>
      </Group>
    </form>
  )
}
