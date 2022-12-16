import { SurveyModel } from '@/domain/models'

export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add (surveyData: AddSurveyParams): Promise<void>
}
