import { HttpRequest, SurveyModel, SurveyResultModel, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel } from '@/presentation/controllers/controllers-protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidden, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const makeFakeSurvey = (answer: string, id: string): SurveyModel => ({
  id,
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer
  }],
  date: new Date()
})

const makeFakeSurveyResult = (
  accountId = faker.database.mongodbObjectId(),
  surveyId = faker.database.mongodbObjectId(),
  answer = faker.random.word()
): SurveyResultModel => ({
  id: faker.database.mongodbObjectId(),
  accountId,
  surveyId,
  answer,
  date: new Date()
})

const makeFakeRequest = (answer = faker.random.word()): HttpRequest => ({
  params: {
    surveyId: faker.database.mongodbObjectId()
  },
  body: {
    answer
  },
  accountId: faker.database.mongodbObjectId()
})

const makeLoadSurverById = (survey: SurveyModel): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (_surveyId: String): Promise<SurveyModel> {
      return survey
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (surveyResult: SurveyResultModel): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (_surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return surveyResult
    }
  }

  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurverByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (
  survey = makeFakeSurvey(faker.random.word(), faker.database.mongodbObjectId()),
  surveyResult = makeFakeSurveyResult()
): SutTypes => {
  const loadSurverByIdStub = makeLoadSurverById(survey)
  const saveSurveyResultStub = makeSaveSurveyResult(surveyResult)
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
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

  it('Should return forbidden if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: faker.database.mongodbObjectId()
      },
      body: {
        answer: faker.random.words()
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const answer = faker.random.word()
    const httpRequest = makeFakeRequest(answer)
    const surveyMock = makeFakeSurvey(answer, httpRequest.params.surveyId)
    const surveyResultMock = makeFakeSurveyResult(httpRequest.accountId, httpRequest.params.surveyId, answer)

    const { sut, saveSurveyResultStub } = makeSut(surveyMock, surveyResultMock)
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(httpRequest)

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer,
      date: new Date()
    })
  })
})
