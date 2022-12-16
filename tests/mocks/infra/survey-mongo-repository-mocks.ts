import { AddSurveyParams, AddSurveyRepository, LoadSurveyByIdRepository, SurveyModel } from '@/data/protocols'

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
