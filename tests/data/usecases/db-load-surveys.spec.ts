import { LoadSurveysRepository } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveys } from '@/data/usecases'
import { mockLoadSurveysRepository, mockSurveyList } from '@/tests/mocks'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (surveysList = mockSurveyList()): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository(surveysList)
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys ', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  it('Should return a list of surveys on success', async () => {
    const surveysList = mockSurveyList()
    const { sut } = makeSut(surveysList)
    const surveys = await sut.load()
    expect(surveys).toEqual(surveysList)
  })

  it('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
