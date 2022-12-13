import { AddSurveyModel } from '@/domain/usecases'

export interface AddSurveyRepository {
  add (surveyData: AddSurveyModel): Promise<void>
}
