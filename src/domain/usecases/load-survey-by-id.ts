import { SurveyModel } from '@/domain/models'

export interface LoadSurveyById {
  load (surveyId: String): Promise<SurveyModel>
}
