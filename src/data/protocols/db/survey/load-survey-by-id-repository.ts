import { SurveyModel } from '@/domain/models'

export interface LoadSurveyByIdRepository {
  loadById (surveyId: string): Promise<SurveyModel>
}
