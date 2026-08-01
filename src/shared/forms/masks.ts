type MaskDefinition = string | { mask: string; definitions?: Record<string, RegExp> }

export const masks = {
  phone: {
    mask: '+{7} (Z00) 000-00-00',
    definitions: { Z: /[3-9]/ },
  },
  verificationCode: '000000',
  date: '00.00.0000',
  postalCode: '000000',
} as const satisfies Record<string, MaskDefinition>

export type MaskId = keyof typeof masks
export type Mask = (typeof masks)[MaskId]
