import { z } from 'zod'

export const ruErrorMap: z.ZodErrorMap = (issue) => {
  switch (issue.code) {
    case 'invalid_type':
      return { message: issue.input == null ? 'Обязательное поле' : 'Введите корректное значение' }
    case 'too_small':
      if (issue.origin === 'string') {
        return {
          message: issue.minimum === 1 ? 'Обязательное поле' : `Минимум ${issue.minimum} символов`,
        }
      }
      return { message: `Значение должно быть не меньше ${issue.minimum}` }
    case 'too_big':
      if (issue.origin === 'string') return { message: `Максимум ${issue.maximum} символов` }
      return { message: `Значение должно быть не больше ${issue.maximum}` }
    case 'invalid_format':
      if (issue.format === 'email') return { message: 'Введите корректный email' }
      break
    case 'not_multiple_of':
      return { message: `Значение должно быть кратно ${issue.divisor}` }
  }

  return { message: 'Введите корректное значение' }
}

export function configureRussianZodErrors() {
  z.config({ customError: ruErrorMap })
}
