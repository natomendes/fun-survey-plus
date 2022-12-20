import { LoadSurveyResultRepository, SaveSurveyResultParams, SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'

export const mockSaveSurveyResultRepository = (surveyResult: SurveyResultModel): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async saveResult (_saveSurveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return surveyResult
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (surveyResult: SurveyResultModel): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (_surveyId: string): Promise<SurveyResultModel> {
      return surveyResult
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
