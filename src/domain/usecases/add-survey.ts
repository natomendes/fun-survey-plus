import { SurveyModel } from '@/domain/models'

export type AddSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add (surveyData: AddSurveyModel): Promise<void>
}
