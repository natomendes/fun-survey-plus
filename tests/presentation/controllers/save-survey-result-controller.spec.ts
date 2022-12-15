import { HttpRequest, SurveyModel } from '@/presentation/controllers/controllers-protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { LoadSurveyById } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

const makeFakeSurvey = (): SurveyModel => ({
  id: faker.database.mongodbObjectId(),
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }],
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.database.mongodbObjectId()
  },
  body: {}
})

const makeLoadSurverById = (survey: SurveyModel): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (_surveyId: String): Promise<SurveyModel> {
      return survey
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurverByIdStub: LoadSurveyById
}

const makeSut = (survey = makeFakeSurvey()): SutTypes => {
  const loadSurverByIdStub = makeLoadSurverById(survey)
  const sut = new SaveSurveyResultController(loadSurverByIdStub)
  return {
    sut,
    loadSurverByIdStub
  }
}

describe('SaveSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurverByIdStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })
})
