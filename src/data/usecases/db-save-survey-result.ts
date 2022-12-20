import { LoadSurveyResultRepository, SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/usecases-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.saveResult(surveyData)
    return await this.loadSurveyResultRepository.loadBySurveyId(surveyData.surveyId, surveyData.accountId)
  }
}
