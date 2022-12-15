import { SaveSurveyResult, SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.saveResult(surveyData)

    return null
  }
}
