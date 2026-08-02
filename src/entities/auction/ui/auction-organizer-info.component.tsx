import { Divider, Stack, Text } from '@mantine/core'
import type { AuctionShowOrganizer, Contact } from '@/shared/api/generated/model'
import { AuctionContactLinks } from './auction-contact-links.component'
import { AuctionDataTable } from './auction-data-table.component'
import { AuctionDetailSection } from './auction-detail-section.component'

export function AuctionOrganizerInfo({
  organizer,
  contacts,
}: {
  organizer: AuctionShowOrganizer
  contacts: Contact[]
}) {
  return (
    <AuctionDetailSection title='Организатор'>
      <AuctionDataTable
        rows={[
          ['Организация', organizer.organization_name ?? '—'],
          ['ИНН', organizer.organization_inn ?? '—'],
          ['КПП', organizer.organization_kpp ?? '—'],
          ['Код организации', organizer.infobase_code ?? organizer.subscriber_code ?? '—'],
        ]}
      />
      {contacts.length > 0 && (
        <>
          <Divider my='md' />
          <Text
            size='sm'
            fw={600}
            mb='xs'
          >
            Контакты
          </Text>
          <Stack gap='xs'>
            {contacts.map((contact, index) => (
              <Text
                key={`${contact.uid ?? contact.phone ?? 'contact'}-${index}`}
                size='sm'
              >
                <AuctionContactLinks contact={contact} />
              </Text>
            ))}
          </Stack>
        </>
      )}
    </AuctionDetailSection>
  )
}
