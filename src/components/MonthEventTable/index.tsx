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
  year: number
  month: number
}

let totalMinutesMonth = 0
const expectedHoursPerDay = 8
const minutesPerHour = 60
const minutesTolerance = 10

const withinTolerance = (hours: number, minutes: number) => {
  return (
    (hours === expectedHoursPerDay && minutes <= minutesTolerance) ||
    (hours === expectedHoursPerDay - 1 &&
      minutes >= minutesPerHour - minutesTolerance)
  )
}

const belowExpected = (hours: number, minutes: number) => {
  return (
    hours < expectedHoursPerDay ||
    (hours < expectedHoursPerDay && minutes < minutesPerHour - minutesTolerance)
  )
}

const isSaturdayOrSunday = (year: number, month: number, day: number) => {
  const date = new Date()
  date.setFullYear(year, month, day)

  const weekendDays = [
    'Sunday',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    'Saturday'
  ]
  const currentDayOfWeek = weekendDays[date.getDay()]

  return !!currentDayOfWeek
}

const ajustTime = (time: string | number) => {
  if (time < 10) {
    return `0${Number(time)}`
  }

  return time
}

const calculateHoursDifference = (
  year: number,
  month: number,
  day: number,
  hours: string,
  minutes: string
) => {
  const workedHours = Number(hours)
  const workedMinutes = Number(minutes)

  if (workedHours === 0 && workedMinutes === 0) {
    return 'Folga'
  }

  if (isSaturdayOrSunday(year, month, day)) {
    return `${hours}:${ajustTime(minutes)} (Extra)`
  }

  if (withinTolerance(workedHours, workedMinutes)) {
    return '0'
  }

  const hoursDifference = workedHours - expectedHoursPerDay
  const minutesDifference = minutesPerHour - workedMinutes

  if (belowExpected(workedHours, workedMinutes)) {
    let ajustHours: number | string = hoursDifference + 1
    totalMinutesMonth = totalMinutesMonth - minutesDifference
    totalMinutesMonth = totalMinutesMonth - ajustHours * minutesPerHour * -1
    ajustHours = ajustHours < 0 ? ajustHours : `-${ajustHours}`

    return `${ajustHours}:${ajustTime(minutesDifference)}`
  }

  if (hoursDifference === 0 && workedMinutes > minutesTolerance) {
    totalMinutesMonth += workedMinutes

    return `+0:${ajustTime(minutes)}`
  }

  totalMinutesMonth = totalMinutesMonth + workedMinutes
  totalMinutesMonth = totalMinutesMonth + hoursDifference * minutesPerHour

  return `+${hoursDifference}:${ajustTime(minutes)}`
}

const minutesToHoursAndMinutes = (totalMinutes: number) => {
  if (totalMinutes < 0) {
    totalMinutes = totalMinutes * -1
  }

  const hours = Math.floor(totalMinutes / minutesPerHour)
  const minutes = totalMinutes % minutesPerHour

  return `${hours}:${ajustTime(minutes)}`
}

export const MonthEventTable = ({
  data,
  year,
  month
}: MonthEventTableProps) => {
  totalMinutesMonth = 0

  const colorRule = (
    open: boolean,
    hours: string,
    minutes: string,
    day: number
  ) => {
    if (open) {
      return 'red.400'
    }

    if (isSaturdayOrSunday(year, month, day)) {
      return 'green.300'
    }

    const numberHours = Number(hours)
    const numberMinutes = Number(minutes)

    if (withinTolerance(numberHours, numberMinutes)) {
      return 'blue.400'
    }

    if (belowExpected(numberHours, numberMinutes)) {
      return 'red.400'
    }

    return 'green.400'
  }

  return (
    <TableContainer width="full">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Dia</Th>
            <Th>Registros</Th>
            <Th isNumeric>Total</Th>
            <Th isNumeric>Diferença</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(
            ({ day, timestamps, totalHours: { hours, open, minutes } }) => (
              <Tr key={day}>
                <Td>{day}</Td>
                <Td whiteSpace={{ base: 'break-spaces', md: 'normal' }}>
                  {timestamps}
                </Td>
                <Td color={colorRule(open, hours, minutes, day)} isNumeric>
                  {open ? 'Incompleto' : `${hours}:${minutes}`}{' '}
                </Td>
                <Td color={colorRule(open, hours, minutes, day)} isNumeric>
                  {!open &&
                    calculateHoursDifference(year, month, day, hours, minutes)}
                </Td>
              </Tr>
            )
          )}
          <Tr>
            <Td colSpan={3} isNumeric>
              Total
            </Td>
            <Td
              color={totalMinutesMonth < 0 ? 'red.400' : 'green.400'}
              isNumeric
            >
              {totalMinutesMonth < 0 ? '-' : '+'}
              {minutesToHoursAndMinutes(totalMinutesMonth)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
