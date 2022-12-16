import { LoadSurveyByIdRepository } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveyById } from '@/data/usecases'
import { mockLoadSurveyByIdRepository, mockSurvey } from '@/tests/mocks'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (survey = mockSurvey()): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(survey)
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  it('Should call LoadSurveyByIdRepository with correct value', async () => {
    const survey = mockSurvey()
    const { sut, loadSurveyByIdRepositoryStub } = makeSut(survey)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load(survey.id)
    expect(loadByIdSpy).toHaveBeenCalledWith(survey.id)
  })

  it('Should return a survey on success', async () => {
    const surveyResult = mockSurvey()
    const { sut } = makeSut(surveyResult)
    const survey = await sut.load(surveyResult.id)
    expect(survey).toEqual(surveyResult)
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
