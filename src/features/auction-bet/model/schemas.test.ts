import { describe, expect, it } from 'vitest'
import { createAuctionBetSchema } from './schemas'

describe('createAuctionBetSchema', () => {
  const schema = createAuctionBetSchema(100000, 145000, 1000)

  it('accepts a price inside the configured range and step', () => {
    expect(schema.safeParse({ price: 132000 }).success).toBe(true)
  })

  it('rejects prices outside the range or step', () => {
    expect(schema.safeParse({ price: 99000 }).success).toBe(false)
    expect(schema.safeParse({ price: 145001 }).success).toBe(false)
    expect(schema.safeParse({ price: 132500 }).success).toBe(false)
  })

  it('allows a decimal value when it is aligned to a decimal step', () => {
    const decimalSchema = createAuctionBetSchema(undefined, undefined, 0.1)

    expect(decimalSchema.safeParse({ price: 0.3 }).success).toBe(true)
  })
})
