import { SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.saveResult(surveyData)
  }
}
