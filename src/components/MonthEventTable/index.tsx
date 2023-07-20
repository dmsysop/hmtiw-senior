import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { DailyData } from '../../hooks/useSenior/types'

export type MonthEventTableProps = {
  data: DailyData[]
}

const calculateHoursDifference = (hours: string) => {
  const workedHours = Number(hours)
  const expectedHoursPerDay = 8

  if (workedHours === 0) {
    return 'Folga'
  }

  const hoursDifference = workedHours - expectedHoursPerDay
  return `${hoursDifference >= 0 ? '+' : ''}${hoursDifference}`
}

export const MonthEventTable = ({ data }: MonthEventTableProps) => {
  const colorRule = (open: boolean, hours: string) =>
    !open && Number(hours) >= 8 ? 'green.400' : 'red.400'

  return (
    <TableContainer width="full">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Dia</Th>
            <Th>Registros</Th>
            <Th isNumeric>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(
            ({ date, timestamps, totalHours: { hours, open, minutes } }) => (
              <Tr key={date}>
                <Td>{date}</Td>
                <Td whiteSpace={{ base: 'break-spaces', md: 'normal' }}>
                  {timestamps}
                </Td>
                <Td color={colorRule(open, hours)} isNumeric>
                  {open ? 'Incompleto' : `${hours}:${minutes}`}{' '}
                  {!open && calculateHoursDifference(hours)}
                </Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
