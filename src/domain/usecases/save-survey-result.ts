import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel>
}
