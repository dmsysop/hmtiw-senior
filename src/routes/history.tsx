import { HStack, Select, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MonthEventTable } from '../components/MonthEventTable'
import { useSeniorContext } from '../hooks/useSenior'

export const History = () => {
  const { monthlyReport, year, setYear } = useSeniorContext()
  const [value, setValue] = useState(-1)
  const date = new Date()
  const currentYear = date.getFullYear()

  return (
    <VStack width="full" marginX={{ base: '1rem', md: '5rem' }} paddingY="5rem">
      <HStack width="full">
        <Select
          width="70%"
          placeholder="Escolha um mês"
          variant="flushed"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        >
          {monthlyReport.map((_, index) => {
            date.setMonth(index)
            return (
              <option key={index} value={index}>
                {date.toLocaleString('pt-BR', { month: 'long' }).toUpperCase()}
              </option>
            )
          })}
        </Select>
        <Select
          width="30%"
          variant="flushed"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
        >
          {[currentYear, currentYear - 1].map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </Select>
      </HStack>

      {value >= 0 && <MonthEventTable data={monthlyReport[value]} />}
    </VStack>
  )
}
