import { SaveSurveyResultModel, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export interface SaveSurveyResultRepository {
  saveResult (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel>
}
