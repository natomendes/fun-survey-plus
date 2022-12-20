import { HttpRequest, LoadSurveyById, LoadSurveyResult } from '@/presentation/controllers/controllers-protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { mockLoadSurverById, mockLoadSurveyResult, mockSurveyResult } from '@/tests/mocks'
import { faker } from '@faker-js/faker'

const surveyId = faker.database.mongodbObjectId()
const surveyResult = mockSurveyResult(surveyId)

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurverByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurverByIdStub = mockLoadSurverById()
  const loadSurveyResultStub = mockLoadSurveyResult(surveyResult)
  const sut = new LoadSurveyResultController(loadSurverByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurverByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurverByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should return forbidden if LoadSurveyById returns null', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return server error if LoadSurveyById throws', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should return server error if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should return ok on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(surveyResult))
  })
})
