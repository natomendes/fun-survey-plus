import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/usecases/usecases-protocols'
import { DbSaveSurveyResult } from '@/data/usecases'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultParams, mockSaveSurveyResultRepository, mockSurveyResult } from '@/tests/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (surveyResult = mockSurveyResult()): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository(surveyResult)
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult', () => {
  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveResultSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
    await sut.save(saveSurveyResultParams)
    expect(saveResultSpy).toHaveBeenCalledWith(saveSurveyResultParams)
  })

  it('Should call LoadSurveyResultRepository with correct value', async () => {
    const saveSurveyResultParams = mockSaveSurveyResultParams()
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(saveSurveyResultParams)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(saveSurveyResultParams.surveyId, saveSurveyResultParams.accountId)
  })

  it('Should return a survey result on success', async () => {
    const surveyId = faker.database.mongodbObjectId()
    const surveyResultMock = mockSurveyResult(surveyId)
    const saveSurveyResultParams = mockSaveSurveyResultParams(surveyId)
    const { sut } = makeSut(surveyResultMock)
    const surveyResult = await sut.save(saveSurveyResultParams)
    expect(surveyResult).toEqual(surveyResultMock)
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
