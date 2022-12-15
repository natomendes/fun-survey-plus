import { faker } from '@faker-js/faker'
import { SurveyModel, LoadSurveysRepository } from '@/data/usecases/usecases-protocols'
import { DbLoadSurveys } from '@/data/usecases'

const makeFakeSurveysList = (): SurveyModel[] => [{
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }],
  date: new Date()
}, {
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }],
  date: new Date()
}]

const makeLoadSurveysRepositoryStub = (surveysList: SurveyModel[]): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return surveysList
    }
  }
  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (surveysList = makeFakeSurveysList()): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub(surveysList)
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
})
