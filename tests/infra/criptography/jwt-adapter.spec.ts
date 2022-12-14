import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { faker } from '@faker-js/faker'

const token = faker.datatype.uuid()
const secret = faker.datatype.uuid()
const decryptedToken = faker.datatype.string()

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return token
  },

  verify (): string {
    return decryptedToken
  }
}))

const makeSut = (secret = faker.datatype.uuid()): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('Should call sign with correct values', async () => {
      const sut = makeSut(secret)
      const signSpy = jest.spyOn(jwt, 'sign')
      const id = faker.datatype.uuid()
      await sut.encrypt(id)

      expect(signSpy).toHaveBeenCalledWith({ id }, secret)
    })

    it('Should return a token on jwt sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt(faker.datatype.uuid())

      expect(accessToken).toBe(token)
    })

    it('Should throw if jwt sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })

      const promise = sut.encrypt(faker.datatype.uuid())

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('Should call verify with correct values', async () => {
      const sut = makeSut(secret)
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(token)

      expect(verifySpy).toHaveBeenCalledWith(token, secret)
    })

    it('Should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt(token)

      expect(value).toBe(decryptedToken)
    })

    it('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })

      const promise = sut.decrypt(token)

      await expect(promise).rejects.toThrow()
    })
  })
})
