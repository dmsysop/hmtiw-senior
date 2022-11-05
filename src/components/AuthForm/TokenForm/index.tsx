import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input
} from '@chakra-ui/react'

type TokenFormProps = {
  onSubmit: (token: string) => void
}

export const TokenForm = ({ onSubmit }: TokenFormProps) => {
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault()
    if (!event.currentTarget.token.value) return
    onSubmit(event.currentTarget.token.value)
  }

  return (
    <form onSubmit={handleOnSubmit}>
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
