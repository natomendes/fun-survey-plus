import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export interface SaveSurveyResultRepository {
  saveResult (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel>
}
