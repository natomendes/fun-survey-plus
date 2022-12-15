import { SurveyModel } from '@/domain/models'

export interface LoadSurveys {
  load (): Promise<SurveyModel[]>
}
