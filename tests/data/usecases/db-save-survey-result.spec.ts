import { SaveSurveyResultRepository } from '@/data/usecases/usecases-protocols'
import { DbSaveSurveyResult } from '@/data/usecases'
import { mockSaveSurveyResultParams, mockSaveSurveyResultRepository, mockSurveyResult } from '@/tests/mocks'
import { faker } from '@faker-js/faker'

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
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveResultSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
    await sut.save(saveSurveyResultParams)
    expect(saveResultSpy).toHaveBeenCalledWith(saveSurveyResultParams)
  })

  it('Should return a survey result on success', async () => {
    const surveyId = faker.database.mongodbObjectId()
    const surveyResultMock = mockSurveyResult(surveyId)
    const saveSurveyResultParams = mockSaveSurveyResultParams(surveyId)
    const { sut } = makeSut(surveyResultMock)
    const surveyResult = await sut.save(saveSurveyResultParams)
    expect(surveyResult).toEqual(surveyResultMock)
  })

  it('Should throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
