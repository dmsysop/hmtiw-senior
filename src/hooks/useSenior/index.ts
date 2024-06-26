import { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { SeniorContext } from '../../contexts/SeniorContext'
import { clockingEventByActiveUserQuery } from '../../services/senior'
import {
  getTokenCookie,
  removeTokenCookie,
  setTokenCookie
} from '../../utils/token'
import { useNotify } from '../useNotify'
import { monthEventsGroup, timeSpent } from '../../utils/hours'
import { DailyData } from './types'
import { login } from '../../services/senior/login'
import { AuthCredentialRequest } from '../../services/senior/dtos/auth-data'

export const useSeniorContext = () => useContext(SeniorContext)!

export const useSenior = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [year, setYear] = useState(new Date().getFullYear())
  const [clockingEvents, setClockingEvents] = useState<Date[]>([])
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const { requestWarning, tokenError, authenticationError } = useNotify()

  const loadClockingEvents = async () => {
    setLoading(true)
    const data = await clockingEventByActiveUserQuery(token)

    if (data instanceof AxiosError) {
      setLoading(false)
      if (data.response?.status === 401) {
        setToken('')
        removeTokenCookie()
        return tokenError()
      }
      return requestWarning()
    }

    setClockingEvents(data.sort())
    setLoading(false)
  }

  const authenticate = async (data: AuthCredentialRequest) => {
    const token = await login(data)
    if (token instanceof AxiosError) return authenticationError()
    saveToken(token)
  }

  const todayWorkingHours = timeSpent(
    clockingEvents.filter(
      (date) => date.toDateString() === new Date().toDateString()
    ),
    currentDate
  )

  const monthlyReport: DailyData[][] = monthEventsGroup(clockingEvents, year)

  const todayEvents = clockingEvents
    .filter((date) => date.toDateString() === new Date().toDateString())
    .map((date) => date.toLocaleTimeString('en-GB'))
    .join('  ')

  const saveToken = (token: string) => {
    setToken(token)
    setTokenCookie(token)
  }

  useEffect(() => {
    const token = getTokenCookie()

    if (token) setToken(token)
  }, [])

  useEffect(() => {
    if (token) loadClockingEvents()
  }, [token])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const { open, hours, minutes } = todayWorkingHours

    if (open) {
      document.title = `HMTIW Senior (${hours}:${minutes})`
    }
  }, [todayWorkingHours, currentDate])

  return {
    token,
    authenticate,
    setToken,
    clockingEvents,
    todayWorkingHours,
    todayEvents,
    monthlyReport,
    saveToken,
    loading,
    year,
    setYear
  }
}
