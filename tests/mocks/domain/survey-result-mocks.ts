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
    count: 0,
    percent: 0
  }, {
    image: faker.internet.url(),
    answer: mockAnswer,
    count: 0,
    percent: 0
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
