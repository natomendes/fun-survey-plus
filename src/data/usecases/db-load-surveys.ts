import { LoadSurveys, LoadSurveysRepository, SurveyModel } from '@/data/usecases/usecases-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()

    return null
  }
}
