import { WorkingHours } from '../../hooks/useSenior/types'
import { twoDigits } from '../../utils/format'

export const expectedHoursPerDay = 8
export const minutesPerHour = 60
export const minutesTolerance = 10

export type DaySummary = {
  differenceLabel: string
  differenceMinutes: number
  color: string
}

const isWeekend = (year: number, month: number, day: number) =>
  [0, 6].includes(new Date(year, month, day).getDay())

const formatMinutesDifference = (minutes: number) => {
  const signal = minutes < 0 ? '-' : '+'
  const absoluteMinutes = Math.abs(minutes)

  return `${signal}${Math.floor(absoluteMinutes / minutesPerHour)}:${twoDigits(
    absoluteMinutes % minutesPerHour
  )}`
}

export const minutesToHoursAndMinutes = (totalMinutes: number) => {
  const absoluteMinutes = Math.abs(totalMinutes)

  return `${Math.floor(absoluteMinutes / minutesPerHour)}:${twoDigits(
    absoluteMinutes % minutesPerHour
  )}`
}

export const summarizeDay = (
  year: number,
  month: number,
  day: number,
  { hours, minutes, open }: WorkingHours
): DaySummary => {
  if (open) {
    return { differenceLabel: '', differenceMinutes: 0, color: 'red.400' }
  }

  const workedMinutes = Number(hours) * minutesPerHour + Number(minutes)

  if (workedMinutes === 0) {
    return { differenceLabel: 'Folga', differenceMinutes: 0, color: 'blue.400' }
  }

  if (isWeekend(year, month, day)) {
    return {
      differenceLabel: `${hours}:${minutes} (Extra)`,
      differenceMinutes: workedMinutes,
      color: 'green.300'
    }
  }

  const difference = workedMinutes - expectedHoursPerDay * minutesPerHour

  if (Math.abs(difference) <= minutesTolerance) {
    return { differenceLabel: '0', differenceMinutes: 0, color: 'blue.400' }
  }

  return {
    differenceLabel: formatMinutesDifference(difference),
    differenceMinutes: difference,
    color: difference < 0 ? 'red.400' : 'green.400'
  }
}

type Shift = { start: Date; end: Date }

// minutos batidos dentro de um turno de sobreaviso (batidas em pares entrada/saída)
export const onCallWorkedMinutes = (events: Date[], shifts: Shift[]) => {
  let milliseconds = 0

  for (let i = 0; i + 1 < events.length; i += 2) {
    shifts.forEach(({ start, end }) => {
      milliseconds += Math.max(
        0,
        Math.min(events[i + 1].getTime(), end.getTime()) -
          Math.max(events[i].getTime(), start.getTime())
      )
    })
  }

  return Math.floor(milliseconds / 60000)
}

// o que foi trabalhado em sobreaviso é hora recebida (paga): sai do total do dia,
// e o restante segue a regra normal (8h em dia útil, tudo extra no fim de semana)
export const summarizeOnCallDay = (
  year: number,
  month: number,
  day: number,
  totalHours: WorkingHours,
  receivedMinutes: number
) => {
  if (totalHours.open || receivedMinutes === 0) {
    return { ...summarizeDay(year, month, day, totalHours), receivedMinutes: 0 }
  }

  const restMinutes = Math.max(
    0,
    Number(totalHours.hours) * minutesPerHour +
      Number(totalHours.minutes) -
      receivedMinutes
  )
  const rest = summarizeDay(year, month, day, {
    hours: twoDigits(Math.floor(restMinutes / minutesPerHour)),
    minutes: twoDigits(restMinutes % minutesPerHour),
    open: false
  })
  const receivedLabel = `${minutesToHoursAndMinutes(
    receivedMinutes
  )} (Recebida)`

  return {
    differenceLabel:
      rest.differenceMinutes === 0
        ? receivedLabel
        : `${rest.differenceLabel} · ${receivedLabel}`,
    differenceMinutes: rest.differenceMinutes,
    receivedMinutes,
    color: 'purple.400'
  }
}
