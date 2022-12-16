import { LogErrorRepository } from '@/data/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { ok } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/protocols'
import { mockController, mockLogErrorRepository, mockServerError, mockSignUpRequest } from '@/tests/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (name = faker.name.fullName()): SutTypes => {
  const controllerStub = mockController(name)
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockSignUpRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const httpRequest = mockSignUpRequest()
    const { sut } = makeSut(httpRequest.body.name)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ name: httpRequest.body.name }))
  })

  it('Should call LogErrorRepository with correct error if controller returns server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logErrorSPy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(mockServerError())
    const httpRequest = mockSignUpRequest()
    await sut.handle(httpRequest)
    expect(logErrorSPy).toHaveBeenCalledWith('any_stack')
  })
})
