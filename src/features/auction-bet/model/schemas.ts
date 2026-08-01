import { z } from 'zod'
import { fields } from '@/shared/forms/fields'

const isStepAligned = (value: number, step: number) => {
  if (step <= 0) return true
  const remainder = value % step
  const tolerance = Math.max(Math.abs(step) * 1e-9, 1e-7)
  return remainder <= tolerance || Math.abs(step - remainder) <= tolerance
}

export function createAuctionBetSchema(
  min?: number | null,
  max?: number | null,
  step?: number | null,
) {
  let price = fields.price

  if (min !== null && min !== undefined) price = price.min(min, `Цена не может быть ниже ${min}`)
  if (max !== null && max !== undefined) price = price.max(max, `Цена не может быть выше ${max}`)
  if (step !== null && step !== undefined && step > 0) {
    price = price.refine((value) => isStepAligned(value, step), {
      message: `Цена должна быть кратна шагу ${step}`,
    })
  }

  return z.object({ price })
}
