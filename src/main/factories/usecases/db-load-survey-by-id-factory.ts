import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyById } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
