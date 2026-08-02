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
  return z.object({ price: fields.price }).superRefine(({ price }, context) => {
    if (min !== null && min !== undefined && price < min) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Цена не может быть ниже ${min}`,
      })
      return
    }

    if (max !== null && max !== undefined && price > max) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Цена не может быть выше ${max}`,
      })
      return
    }

    if (step !== null && step !== undefined && step > 0 && !isStepAligned(price, step)) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Цена должна быть кратна шагу ${step}`,
      })
    }
  })
}
