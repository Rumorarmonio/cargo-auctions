import { Anchor } from '@mantine/core'
import { normalizePhoneForHref } from '@/shared/forms/phone'

type ContactLinkData = {
  name?: string | null
  phone?: string | null
  email?: string | null
}

export function AuctionContactLinks({ contact }: { contact: ContactLinkData }) {
  return (
    <>
      {contact.name ?? 'Контакт'}
      {contact.phone && (
        <>
          {' · '}
          <Anchor href={`tel:${normalizePhoneForHref(contact.phone)}`}>{contact.phone}</Anchor>
        </>
      )}
      {contact.email && (
        <>
          {' · '}
          <Anchor href={`mailto:${contact.email}`}>{contact.email}</Anchor>
        </>
      )}
    </>
  )
}
