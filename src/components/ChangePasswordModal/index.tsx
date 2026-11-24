import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSeniorContext } from '../../hooks/useSenior'

export const ChangePasswordModal = () => {
  const { mustChangePassword, updatePassword, dismissPasswordChange } =
    useSeniorContext()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const mismatch = confirmation !== '' && confirmation !== password

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault()
    if (!password || mismatch) return

    setSaving(true)
    const failure = await updatePassword(password)
    setSaving(false)

    if (failure) return setError(failure)

    setPassword('')
    setConfirmation('')
    toast({
      title: 'Senha alterada!',
      description: 'Use a nova senha aqui e no app de ponto da Senior.',
      status: 'success'
    })
  }

  return (
    <Modal
      isOpen={mustChangePassword}
      onClose={dismissPasswordChange}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent marginX="4" as="form" onSubmit={handleSubmit}>
        <ModalHeader>Troque sua senha</ModalHeader>
        <ModalBody>
          <VStack spacing="4" alignItems="stretch">
            <Text>
              Sua senha é igual ao seu usuário (CPF), qualquer pessoa que saiba
              seu CPF consegue entrar na sua conta.
            </Text>

            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                A senha é da sua conta Senior: ela também muda no app de ponto
                (Ponto Mobile) e na plataforma Senior X. Use a nova senha para
                bater ponto.
              </AlertDescription>
            </Alert>

            <FormControl isRequired>
              <FormLabel>Nova senha</FormLabel>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>

            <FormControl isRequired isInvalid={mismatch || error !== null}>
              <FormLabel>Confirme a nova senha</FormLabel>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value)
                  setError(null)
                }}
              />
              <FormErrorMessage>
                {mismatch ? 'As senhas não conferem' : error}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter gap="2">
          <Button variant="ghost" onClick={dismissPasswordChange}>
            Agora não
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={saving}
            isDisabled={!password || mismatch}
          >
            Trocar senha
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
