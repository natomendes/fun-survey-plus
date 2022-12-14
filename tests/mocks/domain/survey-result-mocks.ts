import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
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
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    image: faker.internet.url(),
    answer: mockAnswer,
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
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

export const mockSaveSurveyResult = (surveyResult: SurveyResultModel): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (_surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return surveyResult
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (surveyResult: SurveyResultModel): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (_surveyId: string): Promise<SurveyResultModel> {
      return surveyResult
    }
  }

  return new LoadSurveyResultStub()
}
