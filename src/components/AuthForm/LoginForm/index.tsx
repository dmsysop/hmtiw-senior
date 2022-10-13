import { Box, Button, Flex, Heading, Input, Stack } from '@chakra-ui/react'
import { useRef } from 'react'

export const LoginForm = () => {
  const domainInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const domain = domainInputRef.current?.value
    const password = passwordInputRef.current?.value

    if ([domain, password].some((value) => value === '')) return
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
          <form onSubmit={handleOnSubmit}>
            <Stack spacing={4} p="1rem" boxShadow="md">
              <Input
                name="domain"
                placeholder="Domail address"
                ref={domainInputRef}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                ref={passwordInputRef}
              />
              <Button type="submit" width="full">
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  )
}
