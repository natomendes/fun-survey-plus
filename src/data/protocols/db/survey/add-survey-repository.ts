import { AddSurveyParams } from '@/domain/usecases'

export interface AddSurveyRepository {
  add (surveyData: AddSurveyParams): Promise<void>
}
