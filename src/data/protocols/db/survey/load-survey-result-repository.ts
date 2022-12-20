import { SurveyResultModel } from '@/data/usecases/usecases-protocols'

export interface LoadSurveyResultRepository {
  loadBySurveyId (surveyId: string): Promise<SurveyResultModel>
}
