import MockDate from 'mockdate'
import { ServerError } from '@/presentation/errors'
import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadSurveys } from '@/presentation/controllers/controllers-protocols'
import { mockLoadSurveys, mockSurveyList } from '@/tests/mocks'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (surveyList = mockSurveyList()): SutTypes => {
  const loadSurveysStub = mockLoadSurveys(surveyList)
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  it('Should return ok on success', async () => {
    const surveyList = mockSurveyList()
    const { sut } = makeSut(surveyList)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(surveyList))
  })

  it('Should return no content if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  it('Should return server error if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new ServerError('any_stack'))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })
})
