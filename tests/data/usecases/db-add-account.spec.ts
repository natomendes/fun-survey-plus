import { faker } from '@faker-js/faker'
import { DbAddAccount } from '@/data/usecases'
import { AddAccountModel, Hasher, AddAccountRepository, AccountModel, LoadAccountByEmailRepository } from '@/data/usecases/usecases-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeHasherStub = (hashedPassword: string): Hasher => {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return hashedPassword
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_account: AddAccountModel): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (_email: string): Promise<AccountModel> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  hasherStub: Hasher
  sut: DbAddAccount
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeSut = ({ hashedPassword = faker.datatype.uuid() }): SutTypes => {
  const hasherStub = makeHasherStub(hashedPassword)
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
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
    const account = makeFakeAccountData()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith(account.password)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut({})
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const hashedPassword = faker.datatype.uuid()
    const account = makeFakeAccountData()
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
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const account = makeFakeAccount()
    const { id, ...rest } = account
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(rest)
    expect(loadSpy).toHaveBeenCalledWith(account.email)
  })

  it('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount())
    const acknowledged = await sut.add(makeFakeAccountData())
    expect(acknowledged).toBeFalsy()
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut({})
    const acknowledged = await sut.add(makeFakeAccountData())
    expect(acknowledged).toBe(true)
  })
})
