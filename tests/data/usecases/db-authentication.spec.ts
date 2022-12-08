import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models/account'
import { HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/usecases/authentication'
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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (token: string): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_userId: string): Promise<string> {
      return token
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (userId: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = ({ account = makeFakeAccount(), token = faker.datatype.uuid() }): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository(account)
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter(token)
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const email = faker.internet.email()
    await sut.auth(makeFakeAuthentication(email))
    expect(loadSpy).toHaveBeenCalledWith(email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  it('Should call HashComparer with correct values', async () => {
    const account = makeFakeAccount()
    const authentication = makeFakeAuthentication()
    const { sut, hashComparerStub } = makeSut({ account })
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(authentication)
    expect(compareSpy).toHaveBeenCalledWith(authentication.password, account.password)
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut({})
    jest.spyOn(hashComparerStub, 'compare')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut({})
    jest.spyOn(hashComparerStub, 'compare')
      .mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  it('Should call Encrypter with correct id', async () => {
    const account = makeFakeAccount()
    const { sut, encrypterStub } = makeSut({ account })
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith(account.id)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut({})
    jest.spyOn(encrypterStub, 'encrypt')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return the accessToken on success', async () => {
    const token = faker.datatype.uuid()
    const { sut } = makeSut({ token })
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(token)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const account = makeFakeAccount()
    const token = faker.datatype.uuid()
    const { sut, updateAccessTokenRepositoryStub } = makeSut({ account, token })
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith(account.id, token)
  })

  it('Should throw if updateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut({})
    jest.spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })
})
