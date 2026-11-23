import { isDefaultPassword } from './login'

describe('isDefaultPassword', () => {
  it('detecta senha igual ao CPF do usuário', () => {
    expect(
      isDefaultPassword({
        user: '08460903923@gazin.com.br',
        password: '08460903923'
      })
    ).toBe(true)
    expect(
      isDefaultPassword({ user: '08460903923', password: '08460903923' })
    ).toBe(true)
  })

  it('aceita senha diferente do usuário', () => {
    expect(
      isDefaultPassword({ user: '08460903923@gazin.com.br', password: 'outra' })
    ).toBe(false)
  })
})
