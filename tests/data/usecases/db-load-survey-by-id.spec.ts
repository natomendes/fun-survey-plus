import { faker } from '@faker-js/faker'
import { LoadSurveyByIdRepository, SurveyModel } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveyById } from '@/data/usecases'

const makeFakeSurvey = (): SurveyModel => ({
  id: faker.database.mongodbObjectId(),
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }],
  date: new Date()
})

const makeLoadSurveyByIdRepository = (survey: SurveyModel): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (_surveyId: string): Promise<SurveyModel> {
      return survey
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (survey = makeFakeSurvey()): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository(survey)
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  it('Should call LoadSurveyByIdRepository with correct value', async () => {
    const survey = makeFakeSurvey()
    const { sut, loadSurveyByIdRepositoryStub } = makeSut(survey)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load(survey.id)
    expect(loadByIdSpy).toHaveBeenCalledWith(survey.id)
  })
})
