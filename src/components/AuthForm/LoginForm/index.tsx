import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react'
import { useState } from 'react'

type Inputs = {
  domain: string
  password: string
}

export const LoginForm = () => {
  const [inputs, setInputs] = useState<Inputs>({
    domain: '',
    password: ''
  })

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target
  }) => {
    const { name, value } = target
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }))
  }

  const error = {
    domain: inputs.domain === '',
    password: inputs.password === ''
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="green.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form>
            <Stack spacing={4} p="1rem" boxShadow="md">
              <FormControl isInvalid={error.domain}>
                <Input
                  name="domain"
                  placeholder="Domail address"
                  onChange={handleOnChange}
                />
                {error.domain && (
                  <FormErrorMessage>Insira o dominio.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={error.password}>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleOnChange}
                />
                {error.password && (
                  <FormErrorMessage>Insira a senha.</FormErrorMessage>
                )}
              </FormControl>
              <Button
                disabled={error.domain || error.password}
                type="submit"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  )
}
