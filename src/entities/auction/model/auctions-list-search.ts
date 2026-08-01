import { z } from 'zod'
import type { AuctionListRequest } from '@/shared/api/generated/model'

const stringArray = z.preprocess(
  (value) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string' && value.length > 0) return value.split(',')
    return undefined
  },
  z.array(z.string().min(1)).optional(),
)

const numberParam = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.coerce.number().finite().optional(),
)

const booleanParam = z.preprocess((value) => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return undefined
}, z.boolean().optional())

export const auctionsListSearchSchema = z
  .object({
    page: z.coerce.number().int().min(1).catch(1),
    per_page: z.coerce.number().int().min(1).max(50).catch(2),
    cargo_num: z.string().trim().min(1).optional(),
    status: stringArray,
    statuses: stringArray,
    auc_type: stringArray,
    load_city: z.string().trim().min(1).optional(),
    unload_city: z.string().trim().min(1).optional(),
    load_date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    load_date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    is_available: booleanParam,
    is_bidder: booleanParam,
    current_price_from: numberParam,
    current_price_to: numberParam,
  })
  .passthrough()

export type AuctionsListSearch = z.infer<typeof auctionsListSearchSchema>

const dateToIso = (date: string | undefined, endOfDay = false) => {
  if (!date) return undefined
  return `${date}T${endOfDay ? '23:59:59' : '00:00:00'}Z`
}

const optionalBoolean = (value: boolean | undefined) => (value ? true : undefined)

export function toAuctionsListRequest(search: AuctionsListSearch): AuctionListRequest {
  return {
    page: search.page,
    per_page: search.per_page,
    cargo_num: search.cargo_num,
    status: search.status as AuctionListRequest['status'],
    statuses: search.statuses?.map(Number).filter(Number.isInteger),
    auc_type: search.auc_type as AuctionListRequest['auc_type'],
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: dateToIso(search.load_date_from),
    load_date_to: dateToIso(search.load_date_to, true),
    is_available: optionalBoolean(search.is_available),
    is_bidder: optionalBoolean(search.is_bidder),
    current_price_from: search.current_price_from,
    current_price_to: search.current_price_to,
  }
}
