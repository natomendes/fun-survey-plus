import { SaveSurveyResultRepository } from '@/data/usecases/usecases-protocols'
import { DbSaveSurveyResult } from '@/data/usecases'
import { mockSaveSurveyResultRepository, mockSurveyResult } from '@/tests/mocks'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (surveyResult = mockSurveyResult()): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository(surveyResult)
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult', () => {
  it('Should call SaveSurveyRepository with correct values', async () => {
    const { id, ...saveSurveyResult } = mockSurveyResult()
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveResultSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
    await sut.save(saveSurveyResult)
    expect(saveResultSpy).toHaveBeenCalledWith(saveSurveyResult)
  })

  it('Should return a survey result on success', async () => {
    const surveyResultMock = mockSurveyResult()
    const { id, ...saveSurveyResult } = surveyResultMock
    const { sut } = makeSut(surveyResultMock)
    const surveyResult = await sut.save(saveSurveyResult)
    expect(surveyResult).toEqual(surveyResultMock)
  })

  it('Should throw if SaveSurveyRepository throws', async () => {
    const { id, ...saveSurveyResult } = mockSurveyResult()
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(saveSurveyResult)
    await expect(promise).rejects.toThrow()
  })
})
