import { faker } from '@faker-js/faker'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { LoadAccountByToken, AccountModel, HttpRequest } from '@/presentation/middlewares/middlewares-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.datatype.uuid()
})

const makeFakeRequest = (token = faker.datatype.uuid()): HttpRequest => ({
  headers: {
    'x-access-token': token
  }
})

const makeLoadAccountByTokenStub = (account: AccountModel): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (_accessToken: string, _role?: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string, account = makeFakeAccount()): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub(account)
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('Should return forbidden if no x-access-token existis in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct access token', async () => {
    const role = faker.database.column()
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const token = faker.datatype.uuid()
    await sut.handle(makeFakeRequest(token))
    expect(loadSpy).toHaveBeenCalledWith(token, role)
  })

  it('Should return forbidden if LoadAccountByToken returns falsy', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return ok if LoadAccountByToken returns an account', async () => {
    const account = makeFakeAccount()
    const { sut } = makeSut(null, account)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: account.id }))
  })

  it('Should return server error if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
