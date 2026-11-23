import { AxiosError, AxiosResponse } from 'axios'
import { axiosSenior } from './axios-senior'
import { AuthCredentialRequest, AuthTokenResponse } from './dtos/auth-data'

export const login = async ({ user, password }: AuthCredentialRequest) => {
  try {
    const {
      data: { jsonToken }
    } = await axiosSenior.post<any, AxiosResponse<AuthTokenResponse>>(
      't/senior.com.br/bridge/1.0/rest/platform/authentication/actions/login',
      { username: user, password }
    )

    return JSON.parse(jsonToken).access_token as string
  } catch (error) {
    return error as AxiosError
  }
}

export const usernameOf = (user: string) => user.split('@')[0]

// senha padrão da Senior é o próprio usuário (CPF)
export const isDefaultPassword = ({ user, password }: AuthCredentialRequest) =>
  password === usernameOf(user) || password === user

export const changePassword = async (
  token: string,
  { user, password }: AuthCredentialRequest,
  newPassword: string
) => {
  try {
    await axiosSenior.post(
      't/senior.com.br/bridge/1.0/rest/platform/user/actions/changePassword',
      { username: usernameOf(user), currentPassword: password, newPassword },
      { headers: { Authorization: 'bearer ' + token } }
    )
    return null
  } catch (error) {
    return (
      (error as AxiosError<{ message?: string }>).response?.data?.message ??
      'Não foi possível trocar a senha'
    )
  }
}
