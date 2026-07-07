import { DailyData, WorkingHours } from '../../hooks/useSenior/types'
import { twoDigits } from '../format'

const isOdd = (value: number) => value % 2 !== 0

export const timeSpent = (events: Date[], currentDate?: Date): WorkingHours => {
  const open = isOdd(events.length)

  if (events.length === 0) {
    return { hours: twoDigits(0), minutes: twoDigits(0), open }
  }

  if (open) events.push(currentDate ?? new Date())

  let time = 0

  for (let i = 0; i < events.length; i = i + 2) {
    time += (events[i + 1].getTime() - events[i].getTime()) / 1000
  }

  const hours = time / 3600
  const minutes = (hours % 1) * 60

  return {
    hours: twoDigits(Math.floor(hours)),
    minutes: twoDigits(Math.floor(minutes)),
    open
  }
}

const expectedHoursPerDay = 8
const minutesPerHour = 60
const minutesTolerance = 10

const withinHoursTolerance = (hours: number, minutes: number) =>
  (hours === expectedHoursPerDay && minutes <= minutesTolerance) ||
  (hours === expectedHoursPerDay - 1 &&
    minutes >= minutesPerHour - minutesTolerance)

const isWeekend = (year: number, month: number, day: number) => {
  const date = new Date()
  date.setFullYear(year, month, day)
  return date.getDay() === 0 || date.getDay() === 6
}

export const calculateMonthBalance = (
  data: DailyData[],
  year: number,
  month: number
): number => {
  let total = 0

  for (const {
    day,
    totalHours: { hours, minutes, open }
  } of data) {
    if (open) continue

    const workedHours = Number(hours)
    const workedMinutes = Number(minutes)

    if (workedHours === 0 && workedMinutes === 0) continue
    if (isWeekend(year, month, day)) continue
    if (withinHoursTolerance(workedHours, workedMinutes)) continue

    total +=
      workedMinutes +
      workedHours * minutesPerHour -
      expectedHoursPerDay * minutesPerHour
  }

  return total
}

export const minutesToHoursDisplay = (totalMinutes: number): string => {
  const abs = Math.abs(totalMinutes)
  const hours = Math.floor(abs / minutesPerHour)
  const minutes = abs % minutesPerHour
  const sign = totalMinutes < 0 ? '-' : '+'
  return `${sign}${hours}:${twoDigits(minutes)}`
}

export const monthEventsGroup = (clockingEvents: Date[], year: number) => {
  const days = Array.from({ length: 12 }, () =>
    Array.from({ length: 31 }, () => new Array(0))
  )

  const dates = clockingEvents.filter((date) => date.getFullYear() === year)

  dates.forEach((date) => {
    days[date.getMonth()][date.getDate() - 1].push(date)
  })

  return days.map((month) => {
    return month.map((day, index) => {
      const timestamps = day
        .map((date) => date.toLocaleTimeString('en-GB'))
        .join('  ')

      return {
        timestamps,
        totalHours: timeSpent(day),
        day: index + 1
      }
    })
  })
}
