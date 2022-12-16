import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper'
import { AddSurvey, Validation } from '@/presentation/controllers/controllers-protocols'
import { mockAddSurvey, mockAddSurveyHttpRequest, mockValidation } from '@/tests/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockAddSurveyHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return bad request if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockAddSurveyHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = mockAddSurveyHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return server error if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new ServerError('any_stack'))
    const httpResponse = await sut.handle(mockAddSurveyHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should return no content on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockAddSurveyHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
