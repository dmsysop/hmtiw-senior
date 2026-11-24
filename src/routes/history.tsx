import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Button,
  HStack,
  Heading,
  IconButton,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MonthEventTable } from '../components/MonthEventTable'
import { useSeniorContext } from '../hooks/useSenior'
import { useNotify } from '../hooks/useNotify'
import { OnCallShift, onCallShifts, watchmanLogin } from '../services/watchman'
import {
  getTokenCookie,
  removeTokenCookie,
  setTokenCookie,
  watchmanTokenKey
} from '../utils/token'

export const History = () => {
  const today = new Date()
  const { monthlyReport, year, setYear } = useSeniorContext()
  const { authenticationError } = useNotify()
  const [month, setMonth] = useState(today.getMonth())

  const [shifts, setShifts] = useState<OnCallShift[]>([])
  // login próprio do Watchman (e-mail), separado do token da Senior
  const [watchmanToken, setWatchmanToken] = useState(
    getTokenCookie(watchmanTokenKey) ?? ''
  )
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let stale = false
    setShifts([])
    if (!watchmanToken) return

    onCallShifts(watchmanToken, year, month).then((result) => {
      if (stale) return
      if (result) return setShifts(result)
      removeTokenCookie(watchmanTokenKey)
      setWatchmanToken('')
    })
    return () => {
      stale = true
    }
  }, [watchmanToken, year, month])

  const signInWatchman: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    setSigningIn(true)
    const token = await watchmanLogin(
      String(form.get('login')),
      String(form.get('password'))
    )
    setSigningIn(false)

    if (!token) return authenticationError()
    setTokenCookie(token, watchmanTokenKey)
    setWatchmanToken(token)
  }

  // só há dados do ano atual e do anterior
  const isFirst = year === today.getFullYear() - 1 && month === 0
  const isLast = year === today.getFullYear() && month === today.getMonth()

  const go = (step: number) => {
    const target = new Date(year, month + step)
    setYear(target.getFullYear())
    setMonth(target.getMonth())
  }

  return (
    <VStack
      width="full"
      maxW="720px"
      paddingX="4"
      paddingY={{ base: '6', md: '12' }}
      spacing="4"
    >
      <HStack width="full" justifyContent="space-between">
        <IconButton
          aria-label="Mês anterior"
          icon={<ChevronLeftIcon boxSize="6" />}
          variant="ghost"
          borderRadius="full"
          isDisabled={isFirst}
          onClick={() => go(-1)}
        />
        <Heading size="md" textTransform="capitalize">
          {new Date(year, month).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
          })}
        </Heading>
        <IconButton
          aria-label="Próximo mês"
          icon={<ChevronRightIcon boxSize="6" />}
          variant="ghost"
          borderRadius="full"
          isDisabled={isLast}
          onClick={() => go(1)}
        />
      </HStack>

      <MonthEventTable
        year={year}
        month={month}
        data={monthlyReport[month]}
        onCall={shifts}
      />

      {!watchmanToken && (
        <form onSubmit={signInWatchman} style={{ width: '100%' }}>
          <VStack width="full" spacing="2">
            <Text fontSize="sm" color="gray.500">
              Entre no Watchman para separar as horas de sobreaviso
            </Text>
            <HStack width="full">
              <Input
                name="login"
                type="email"
                size="sm"
                placeholder="E-mail"
                autoComplete="username"
                isRequired
              />
              <Input
                name="password"
                type="password"
                size="sm"
                placeholder="Senha"
                autoComplete="current-password"
                isRequired
              />
              <Button
                type="submit"
                size="sm"
                paddingX="6"
                isLoading={signingIn}
              >
                Entrar
              </Button>
            </HStack>
          </VStack>
        </form>
      )}
    </VStack>
  )
}
