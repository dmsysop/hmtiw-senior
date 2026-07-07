import {
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import { useSeniorContext } from '../hooks/useSenior'
import { calculateMonthBalance, minutesToHoursDisplay } from '../utils/hours'

const MONTHS = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO'
]

export const Balance = () => {
  const date = new Date()
  const { monthlyReport, year, setYear } = useSeniorContext()
  const currentYear = date.getFullYear()

  const monthBalances = monthlyReport.map((monthData, index) =>
    calculateMonthBalance(monthData, year, index)
  )

  const totalBalance = monthBalances.reduce((acc, val) => acc + val, 0)

  const balanceColor = (minutes: number) => {
    if (minutes === 0) return 'blue.400'
    return minutes < 0 ? 'red.400' : 'green.400'
  }

  return (
    <VStack width="full" marginX={{ base: '1rem', md: '5rem' }} paddingY="5rem">
      <Select
        width="full"
        variant="flushed"
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
      >
        {[currentYear, currentYear - 1].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>

      <TableContainer width="full">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Mês</Th>
              <Th isNumeric>Saldo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {MONTHS.map((name, index) => (
              <Tr key={index}>
                <Td>{name}</Td>
                <Td isNumeric color={balanceColor(monthBalances[index])}>
                  {minutesToHoursDisplay(monthBalances[index])}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td>
                <Text fontWeight="bold">SALDO DE HORAS</Text>
              </Td>
              <Td isNumeric color={balanceColor(totalBalance)}>
                <Text fontWeight="bold">
                  {minutesToHoursDisplay(totalBalance)}
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}
