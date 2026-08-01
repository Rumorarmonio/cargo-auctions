import { z } from 'zod'
import { isValidRussianPhone } from './phone'

export const fields = {
  phone: z.string().min(1).refine(isValidRussianPhone, {
    message: 'Введите корректный номер телефона',
  }),

  price: z.number().finite().positive(),
} as const
