import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository, mockSurveyResult } from '@/tests/mocks'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveyResult } from '@/data/usecases'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (surveyResult = mockSurveyResult()): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository({
    id: surveyResult.surveyId,
    question: surveyResult.question,
    answers: [{
      image: surveyResult.answers[0].image,
      answer: surveyResult.answers[0].answer
    }, {
      image: surveyResult.answers[1].image,
      answer: surveyResult.answers[1].answer
    }],
    date: surveyResult.date
  })
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository(surveyResult)
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
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

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load(mockSurveyResult().surveyId)
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
    const surveyResultMock = mockSurveyResult()
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut(surveyResultMock)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null)
    await sut.load(surveyResultMock.surveyId)
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyResultMock.surveyId)
  })

  it('Should return a survey result with count 0 and percent 0 in all answers if LoadSurveyResultRepository return null', async () => {
    const surveyResultMock = mockSurveyResult()
    const { sut, loadSurveyResultRepositoryStub } = makeSut(surveyResultMock)
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null)
    const surveyResult = await sut.load(surveyResultMock.surveyId)
    expect(surveyResult).toEqual(surveyResultMock)
  })
})
