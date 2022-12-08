import { faker } from '@faker-js/faker'
import { AccountModel } from '@/domain/models/account'
import { HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from '@/data/protocols'
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

const makeTokenGenerator = (token: string): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (userId: string): Promise<string> {
      return token
    }
  }
  return new TokenGeneratorStub()
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
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = ({ account = makeFakeAccount(), token = faker.datatype.uuid() }): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository(account)
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator(token)
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
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

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
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

  it('Should call TokenGenerator with correct id', async () => {
    const account = makeFakeAccount()
    const { sut, tokenGeneratorStub } = makeSut({ account })
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith(account.id)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut({})
    jest.spyOn(tokenGeneratorStub, 'generate')
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

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut({})
    jest.spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow(new Error())
  })
})
