import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/usecases-protocols'
import { DbSaveSurveyResult } from '@/data/usecases'
import { faker } from '@faker-js/faker'

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: faker.database.mongodbObjectId(),
  accountId: faker.database.mongodbObjectId(),
  surveyId: faker.datatype.string(),
  answer: faker.random.word(),
  date: new Date()
})

const makeSaveSurveyResultRepository = (surveyResult: SurveyResultModel): SaveSurveyResultRepository => {
  class LoadSurveyByIdRepositoryStub implements SaveSurveyResultRepository {
    async saveResult (_saveSurveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return surveyResult
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (surveyResult = makeFakeSurveyResult()): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository(surveyResult)
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult', () => {
  it('Should call SaveSurveyRepository with correct values', async () => {
    const { id, ...saveSurveyResult } = makeFakeSurveyResult()
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveResultSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'saveResult')
    await sut.save(saveSurveyResult)
    expect(saveResultSpy).toHaveBeenCalledWith(saveSurveyResult)
  })
})
