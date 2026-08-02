const dateFormatter = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
})
const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })
const priceFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

export function formatDate(value?: string | null, includeTime = false) {
  if (!value) return '—'
  return (includeTime ? dateTimeFormatter : dateFormatter).format(new Date(value))
}

export function formatNumber(value?: number | null, suffix = '') {
  return value === undefined || value === null ? '—' : `${numberFormatter.format(value)}${suffix}`
}

export function formatPrice(value?: number | null, emptyLabel = '—') {
  return value === undefined || value === null ? emptyLabel : `${priceFormatter.format(value)} ₽`
}
