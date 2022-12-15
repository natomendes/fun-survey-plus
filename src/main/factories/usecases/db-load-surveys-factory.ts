import { DbLoadSurveys } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
