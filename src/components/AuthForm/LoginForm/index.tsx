import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  Stack
} from '@chakra-ui/react'

export const LoginForm = () => {
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
              <FormControl>
                <InputGroup>
                  <Input placeholder="Domail address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input type="password" placeholder="Password" />
                </InputGroup>
              </FormControl>
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
