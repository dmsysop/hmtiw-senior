import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input
} from '@chakra-ui/react'

type TokenFormProps = {
  saveToken: (token: string) => void
}

export const TokenForm = ({ saveToken }: TokenFormProps) => {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault()
    if (!event.currentTarget.token.value) return
    saveToken(event.currentTarget.token.value)
  }

  return (
    <form onSubmit={onSubmit}>
      <FormControl textAlign="center">
        <FormLabel htmlFor="token" fontWeight="bold">
          Token de autenticação
        </FormLabel>
        <Input placeholder="Token" id="token" required />
        <FormHelperText>Token obtido no login na Senior</FormHelperText>
        <Button type="submit" mt="4" width="full">
          Continuar
        </Button>
      </FormControl>
    </form>
  )
}
