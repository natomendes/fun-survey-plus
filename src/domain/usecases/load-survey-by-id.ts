import { SurveyModel } from '@/domain/models'

export interface LoadSurveyById {
  load (): Promise<SurveyModel>
}
