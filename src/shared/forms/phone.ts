const RU_FIXED_LINE_PATTERN =
  /^(?:336(?:[013-9]\d|2[013-9])\d{5}|(?:3(?:0[12]|4[1-35-79]|5[1-3]|65|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15-7]|6[0-35-79]|7[1-37-9]))\d{7})$/
const RU_MOBILE_PATTERN = /^9\d{9}$/
const RU_TOLL_FREE_PATTERN = /^8(?:0[04]|108\d{3})\d{7}$/
const RU_PERSONAL_PATTERN = /^808\d{7}$/

function normalizeRussianPhone(value: string): string | null {
  const digitsOnly = value.replace(/\D/g, '')

  if (digitsOnly.length === 10) return digitsOnly
  if (digitsOnly.length === 11 && (digitsOnly.startsWith('7') || digitsOnly.startsWith('8'))) {
    return digitsOnly.slice(1)
  }

  return null
}

export function isValidRussianPhone(value: string): boolean {
  const normalizedValue = normalizeRussianPhone(value)
  if (!normalizedValue) return false

  return (
    RU_MOBILE_PATTERN.test(normalizedValue) ||
    RU_TOLL_FREE_PATTERN.test(normalizedValue) ||
    RU_PERSONAL_PATTERN.test(normalizedValue) ||
    RU_FIXED_LINE_PATTERN.test(normalizedValue)
  )
}
