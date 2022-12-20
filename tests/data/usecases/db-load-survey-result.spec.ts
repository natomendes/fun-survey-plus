import { mockLoadSurveyResultRepository, mockSurveyResult } from '@/tests/mocks'
import { LoadSurveyResultRepository } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveyResult } from '@/data/usecases'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (surveyResult = mockSurveyResult()): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository(surveyResult)
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  it('Should call LoadSurveyResultRepository with correct value', async () => {
    const surveyResult = mockSurveyResult()
    const { sut, loadSurveyResultRepositoryStub } = makeSut(surveyResult)
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load(surveyResult.surveyId)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResult.surveyId)
  })

  it('Should return a survey result on success', async () => {
    const surveyResultMock = mockSurveyResult()
    const { sut } = makeSut(surveyResultMock)
    const surveyResult = await sut.load(surveyResultMock.surveyId)
    expect(surveyResult).toEqual(surveyResultMock)
  })
})
