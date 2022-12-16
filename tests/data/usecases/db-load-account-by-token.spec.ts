import { faker } from '@faker-js/faker'
import { DbLoadAccountByToken } from '@/data/usecases'
import { Decrypter, LoadAccountByTokenRepository } from '@/data/usecases/usecases-protocols'
import { mockAccount, mockDecrypter, mockLoadAccountByTokenRepository } from '@/tests/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (
  decryptedToken = faker.datatype.string(),
  account = mockAccount()
): SutTypes => {
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository(account)
  const decrypterStub = mockDecrypter(decryptedToken)
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
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

  it('Should call LoadAccountBytokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    const role = faker.database.column()
    const token = faker.datatype.uuid()
    await sut.load(token, role)
    expect(loadByTokenSpy).toBeCalledWith(token, role)
  })

  it('Should return null if LoadAccountBytokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load(faker.datatype.uuid())
    expect(account).toBeNull()
  })

  it('Should return an account on success', async () => {
    const accountMock = mockAccount()
    const { sut } = makeSut(faker.datatype.string(), accountMock)
    const account = await sut.load(faker.datatype.uuid(), faker.database.column())
    expect(account).toEqual(accountMock)
  })

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load(faker.datatype.uuid(), faker.database.column())
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if LoadAccountBytokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load(faker.datatype.uuid(), faker.database.column())
    await expect(promise).rejects.toThrow()
  })
})
