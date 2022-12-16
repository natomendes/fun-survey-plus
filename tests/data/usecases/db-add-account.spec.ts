import { faker } from '@faker-js/faker'
import { DbAddAccount } from '@/data/usecases'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/usecases/usecases-protocols'
import { mockAccount, mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository, mockAddAccountParams } from '@/tests/mocks'

type SutTypes = {
  hasherStub: Hasher
  sut: DbAddAccount
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = ({ hashedPassword = faker.datatype.uuid() }): SutTypes => {
  const hasherStub = mockHasher(hashedPassword)
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    hasherStub,
    sut,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut({})
    const account = mockAddAccountParams()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith(account.password)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut({})
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const hashedPassword = faker.datatype.uuid()
    const account = mockAddAccountParams()
    const { sut, addAccountRepositoryStub } = makeSut({ hashedPassword })
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(account)
    account.password = hashedPassword
    expect(addSpy).toHaveBeenCalledWith(account)
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut({})
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const account = mockAccount()
    const { id, ...rest } = account
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(rest)
    expect(loadSpy).toHaveBeenCalledWith(account.email)
  })

  it('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(mockAccount())
    const acknowledged = await sut.add(mockAddAccountParams())
    expect(acknowledged).toBeFalsy()
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut({})
    const acknowledged = await sut.add(mockAddAccountParams())
    expect(acknowledged).toBe(true)
  })
})
