import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { LoadSurveysController } from '@/presentation/controllers'
import { SurveyModel, LoadSurveys } from '@/presentation/controllers/controllers-protocols'
import { ok } from '@/presentation/helpers/http-helper'

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

const makeLoadSurveysStub = (surveyList: SurveyModel[]): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return surveyList
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (surveyList = makeFakeSurveysList()): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub(surveyList)
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  it('Should return ok on success', async () => {
    const surveyList = makeFakeSurveysList()
    const { sut } = makeSut(surveyList)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(surveyList))
  })
})
