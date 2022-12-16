import { AddSurveyParams, AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository, SurveyModel } from '@/data/protocols'

export const mockAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (_surveyData: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (survey: SurveyModel): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (_surveyId: string): Promise<SurveyModel> {
      return survey
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (surveysList: SurveyModel[]): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return surveysList
    }
  }
  return new LoadSurveysRepositoryStub()
}
