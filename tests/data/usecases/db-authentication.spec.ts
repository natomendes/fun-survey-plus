import { faker } from '@faker-js/faker'
import { DbAuthentication } from '@/data/usecases'
import { HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from '@/data/usecases/usecases-protocols'
import { mockAccount, mockAuthenticationParams, mockLoadAccountByEmailRepository, mockHashComparer, mockEncrypter, mockUpdateAccessTokenRepository } from '@/tests/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = ({ account = mockAccount(), token = faker.datatype.uuid() }): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository(account)
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter(token)
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
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
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const email = faker.internet.email()
    await sut.auth(mockAuthenticationParams(email))
    expect(loadSpy).toHaveBeenCalledWith(email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut({})
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(null)
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeFalsy()
  })

  it('Should call HashComparer with correct values', async () => {
    const account = mockAccount()
    const authentication = mockAuthenticationParams()
    const { sut, hashComparerStub } = makeSut({ account })
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(authentication)
    expect(compareSpy).toHaveBeenCalledWith(authentication.password, account.password)
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut({})
    jest.spyOn(hashComparerStub, 'compare')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut({})
    jest.spyOn(hashComparerStub, 'compare')
      .mockResolvedValueOnce(false)
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeFalsy()
  })

  it('Should call Encrypter with correct id', async () => {
    const account = mockAccount()
    const { sut, encrypterStub } = makeSut({ account })
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(mockAuthenticationParams())
    expect(encryptSpy).toHaveBeenCalledWith(account.id)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut({})
    jest.spyOn(encrypterStub, 'encrypt')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return the accessToken on success', async () => {
    const token = faker.datatype.uuid()
    const { sut } = makeSut({ token })
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(token)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const account = mockAccount()
    const token = faker.datatype.uuid()
    const { sut, updateAccessTokenRepositoryStub } = makeSut({ account, token })
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    await sut.auth(mockAuthenticationParams())
    expect(updateSpy).toHaveBeenCalledWith(account.id, token)
  })

  it('Should throw if updateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut({})
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(new Error())
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new Error())
  })
})
