import axios, { AxiosError } from 'axios'

export type OnCallShift = { start: Date; end: Date; hours: number }

type UserCallListResponse = {
  userCalls: { start_date: string; final_date: string; hours: number }[]
}

// "De 03/11/2026, 18:00:00h" -> data local
export const parseWatchmanDate = (text: string) => {
  const [, day, month, year, hours, minutes] = text
    .match(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/)!
    .map(Number)

  return new Date(year, month - 1, day, hours, minutes)
}

// o Watchman identifica o usuário pelo e-mail, que vem no JWT dele
const emailOf = (token: string) =>
  JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    .email as string

// ponytail: sem refresh token; quando o access token vence (~24h) pede o login de novo
export const watchmanLogin = async (login: string, password: string) => {
  try {
    const { data } = await axios.post<{ access_token: string }>(
      '/watchman/api/user/login',
      { login, password }
    )

    return data.access_token
  } catch {
    return null
  }
}

// null = token recusado, precisa logar de novo
// /watchman é proxy (vite.config.ts e vercel.json): a API só libera CORS para o próprio Watchman
export const onCallShifts = async (
  token: string,
  year: number,
  month: number
): Promise<OnCallShift[] | null> => {
  try {
    const { data } = await axios.get<UserCallListResponse>(
      '/watchman/api/on-call/user-call-list',
      {
        params: { user: emailOf(token), month: month + 1, year },
        headers: { Authorization: 'bearer ' + token }
      }
    )

    return data.userCalls.map(({ start_date, final_date, hours }) => ({
      start: parseWatchmanDate(start_date),
      end: parseWatchmanDate(final_date),
      hours
    }))
  } catch (error) {
    // qualquer outra falha: o cálculo segue sem sobreaviso
    return (error as AxiosError).response?.status === 401 ? null : []
  }
}
