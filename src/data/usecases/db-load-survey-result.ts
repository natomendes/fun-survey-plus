import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}
  async load (surveyId: string): Promise<SurveyResultModel> {
    return await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
  }
}