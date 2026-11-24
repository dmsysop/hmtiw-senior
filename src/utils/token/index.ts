import Cookie from 'js-cookie'
const tokenLocalKey = 'token-senior'

export const watchmanTokenKey = 'token-watchman'

export const setTokenCookie = (token: string, key = tokenLocalKey) => {
  Cookie.set(key, token, {
    expires: 1,
    secure: location.protocol === 'https:',
    sameSite: 'strict'
  })
}

export const getTokenCookie = (key = tokenLocalKey) => {
  return Cookie.get(key) ?? null
}

export const removeTokenCookie = (key = tokenLocalKey) => {
  Cookie.remove(key)
}
