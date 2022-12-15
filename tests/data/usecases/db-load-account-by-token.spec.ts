import { faker } from '@faker-js/faker'
import { DbLoadAccountByToken } from '@/data/usecases'
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from '@/data/usecases/usecases-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeDecrypterStub = (decryptedToken: string): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_token: string): Promise<string> {
      return decryptedToken
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub = (account: AccountModel): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (
  decryptedToken = faker.datatype.string(),
  account = makeFakeAccount()
): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub(account)
  const decrypterStub = makeDecrypterStub(decryptedToken)
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
    const accountMock = makeFakeAccount()
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
