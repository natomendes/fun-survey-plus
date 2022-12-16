import { SurveyResultModel } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const mockSurveyResult = (
  accountId = faker.database.mongodbObjectId(),
  surveyId = faker.database.mongodbObjectId()
): SurveyResultModel => ({
  id: faker.database.mongodbObjectId(),
  accountId,
  surveyId,
  answer: faker.random.word(),
  date: new Date()
})
