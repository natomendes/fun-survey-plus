import { faker } from '@faker-js/faker'
import { Decrypter } from '@/data/usecases/usecases-protocols'
import { DbLoadAccountByToken } from '@/data/usecases'

const makeDecrypterStub = (decryptedToken: string): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_token: string): Promise<string> {
      return decryptedToken
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (decryptedToken = faker.datatype.string()): SutTypes => {
  const decrypterStub = makeDecrypterStub(decryptedToken)
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const token = faker.datatype.uuid()
    await sut.load(token, faker.datatype.string())
    expect(decryptSpy).toBeCalledWith(token)
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load(faker.datatype.uuid())
    expect(account).toBeNull()
  })
})
