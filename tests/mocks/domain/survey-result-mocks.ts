import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mockAnswer } from './survey-mocks'
import { faker } from '@faker-js/faker'

export const mockSurveyResult = (
  surveyId = faker.database.mongodbObjectId()
): SurveyResultModel => ({
  surveyId,
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word(),
    count: faker.datatype.number(),
    percent: faker.datatype.number()
  }, {
    image: faker.internet.url(),
    answer: mockAnswer,
    count: faker.datatype.number(),
    percent: faker.datatype.number()
  }],
  date: new Date()
})

export const mockSaveSurveyResultParams = (
  surveyId = faker.database.mongodbObjectId(),
  accountId = faker.database.mongodbObjectId(),
  answer = mockAnswer
): SaveSurveyResultParams => ({
  surveyId,
  accountId,
  answer,
  date: new Date()
})
