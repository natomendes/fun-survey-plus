import { SaveSurveyResultParams, SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'

export const mockSaveSurveyResultRepository = (surveyResult: SurveyResultModel): SaveSurveyResultRepository => {
  class LoadSurveyByIdRepositoryStub implements SaveSurveyResultRepository {
    async saveResult (_saveSurveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return surveyResult
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}
