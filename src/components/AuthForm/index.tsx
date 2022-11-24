import { useState } from 'react'
import { TokenForm } from './TokenForm'
import { LoginForm } from './LoginForm'
import { Text } from '@chakra-ui/react'
import { useSeniorContext } from '../../hooks/useSenior'

export const AuthForm = () => {
  const [typeForm, setTypeForm] = useState<boolean>(true)
  const { saveToken, authenticate } = useSeniorContext()

  const toggleTypeForm = () => {
    setTypeForm((prevTypeForm) => !prevTypeForm)
  }

  return (
    <>
      {typeForm ? (
        <LoginForm onSubmit={(credentials) => authenticate(credentials)} />
      ) : (
        <TokenForm onSubmit={(token) => saveToken(token)} />
      )}
      <Text
        color="green.400"
        mt="2"
        _hover={{
          textDecoration: 'underline'
        }}
        onClick={toggleTypeForm}
      >
        {typeForm
          ? 'Entrar com usuário e senha Senior'
          : 'Entrar com token Senior'}
      </Text>
    </>
  )
}
