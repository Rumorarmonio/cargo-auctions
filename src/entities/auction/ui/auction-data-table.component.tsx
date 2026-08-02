import type { ReactNode } from 'react'
import { Table } from '@mantine/core'
import styles from './auction-data-table.module.scss'

export function AuctionDataTable({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <Table
      withRowBorders={false}
      verticalSpacing='xs'
    >
      <Table.Tbody>
        {rows.map(([label, value]) => (
          <Table.Tr key={label}>
            <Table.Td className={styles.label}>{label}</Table.Td>
            <Table.Td>{value}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
