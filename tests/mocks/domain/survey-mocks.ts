import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [{
    image: faker.datatype.string(),
    answer: faker.datatype.string()
  }],
  date: new Date()
})

export const mockSurvey = (): SurveyModel => ({
  id: faker.database.mongodbObjectId(),
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word()
  }],
  date: new Date()
})
