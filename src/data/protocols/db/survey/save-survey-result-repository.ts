import { SaveSurveyResultModel, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export interface SaveSurveyResultRepository {
  saveResult (saveSurveyData: SaveSurveyResultModel): Promise<SurveyResultModel>
}
