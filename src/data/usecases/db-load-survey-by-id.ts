import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from '@/data/usecases/usecases-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async load (surveyId: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(surveyId)
  }
}
