import { AxiosError, AxiosResponse } from 'axios'
import { axiosSeniorGetaway } from './axios-senior'
import { AuthCredentialRequest, AuthTokenResponse } from './dtos/auth-data'

export const login = async (payload: AuthCredentialRequest) => {
  try {
    const {
      data: { token }
    } = await axiosSeniorGetaway.post<any, AxiosResponse<AuthTokenResponse>>(
      'senior/login',
      payload
    )

    return token
  } catch (error) {
    return error as AxiosError
  }
}
