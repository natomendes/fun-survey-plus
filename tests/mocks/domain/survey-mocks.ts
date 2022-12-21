import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAnswer = faker.datatype.string()

export const mockLoadSurveys = (surveyList: SurveyModel[]): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return surveyList
    }
  }
  return new LoadSurveysStub()
}

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (surveyData: AddSurveyParams): Promise<void> {}
  }

  return new AddSurveyStub()
}

export const makeAddSurveyRequest = (): any => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.datatype.string()
  }, {
    answer: mockAnswer
  }]
})

export const mockAddSurveyParams = (): AddSurveyParams => ({
  ...makeAddSurveyRequest(),
  date: new Date()
})

export const mockSurvey = (id = faker.database.mongodbObjectId()): SurveyModel => ({
  id,
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }, {
    image: faker.internet.url(),
    answer: mockAnswer
  }],
  date: new Date()
})

export const mockSurveyList = (): SurveyModel[] => [{
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

export const mockLoadSurverById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (_surveyId: String): Promise<SurveyModel> {
      return mockSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}
