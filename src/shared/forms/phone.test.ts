import { describe, expect, it } from 'vitest'

import { normalizePhoneForHref } from './phone'

describe('normalizePhoneForHref', () => {
  it('removes formatting characters and preserves a leading plus', () => {
    expect(normalizePhoneForHref('+7 (383) 555-10-10')).toBe('+73835551010')
  })

  it('keeps the country prefix when the number uses the 8 format', () => {
    expect(normalizePhoneForHref('8 913 100-20-30')).toBe('89131002030')
  })
})
