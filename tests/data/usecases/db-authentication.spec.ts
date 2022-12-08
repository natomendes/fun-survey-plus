import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/load-account-by-email-repository'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { AuthenticationModel } from '@/domain/usecases'

const makeFakeAccount = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.datatype.uuid()
})

const makeFakeAuthentication = (email = faker.internet.email(), password = faker.internet.password()): AuthenticationModel => ({
  email,
  password
})

const makeLoadAccountByEmailRepository = (account: AccountModel): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (_email: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (account = makeFakeAccount()): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository(account)
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const email = faker.internet.email()
    await sut.auth(makeFakeAuthentication(email))
    expect(loadSpy).toHaveBeenCalledWith(email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })
})
