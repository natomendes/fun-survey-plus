import { DbAddSurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
