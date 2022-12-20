import { HttpRequest, LoadSurveyById, SaveSurveyResult } from '@/presentation/controllers/controllers-protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import { mockAnswer, mockLoadSurverById, mockSaveSurveyResult, mockSurveyResult } from '@/tests/mocks'

const answer = mockAnswer
const accountId = faker.database.mongodbObjectId()
const surveyId = faker.database.mongodbObjectId()

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId
  },
  body: {
    answer
  },
  accountId
})

const surveyResult = mockSurveyResult(surveyId)

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurverByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (
): SutTypes => {
  const loadSurverByIdStub = mockLoadSurverById()
  const saveSurveyResultStub = mockSaveSurveyResult(surveyResult)
  const sut = new SaveSurveyResultController(loadSurverByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurverByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurverByIdStub, 'load')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should return forbidden if LoadSurveyById returns null', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return server error if LoadSurveyById throws', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should return forbidden if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId
      },
      body: {
        answer: faker.random.words()
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId,
      accountId,
      answer,
      date: new Date()
    })
  })

  it('Should return server error if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  it('Should return ok on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(surveyResult))
  })
})
