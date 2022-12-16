import { faker } from '@faker-js/faker'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadAccountByToken } from '@/presentation/middlewares/middlewares-protocols'
import { mockAccount, mockAuthRequest, mockLoadAccountByToken } from '@/tests/mocks'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string, account = mockAccount()): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken(account)
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
    await sut.handle(mockAuthRequest(token))
    expect(loadSpy).toHaveBeenCalledWith(token, role)
  })

  it('Should return forbidden if LoadAccountByToken returns falsy', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockAuthRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return ok if LoadAccountByToken returns an account', async () => {
    const account = mockAccount()
    const { sut } = makeSut(null, account)
    const httpResponse = await sut.handle(mockAuthRequest())
    expect(httpResponse).toEqual(ok({ accountId: account.id }))
  })

  it('Should return server error if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockAuthRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
