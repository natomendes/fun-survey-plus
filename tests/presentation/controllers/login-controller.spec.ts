import { LoginController } from '@/presentation/controllers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http-helper'
import { Authentication, Validation } from '@/presentation/controllers/controllers-protocols'
import { mockAuthentication, mockLoginRequest, mockValidation } from '@/tests/mocks'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = mockLoginRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return unauthorized if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return server error if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should return ok if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'valid_token' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockLoginRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return bad request if Validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
