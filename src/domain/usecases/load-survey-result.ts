import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load (surveyId: string): Promise<SurveyResultModel>
}
