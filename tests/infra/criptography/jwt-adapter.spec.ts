import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  it('Should return a token on jwt sign success', async () => {
    const sut = new JwtAdapter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'valid_token')

    const accessToken = await sut.encrypt('any_value')

    expect(accessToken).toBe('valid_token')
  })
})
