import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from '@/presentation/controllers/controllers-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params: { surveyId } } = httpRequest
    await this.loadSurveyById.load(surveyId)

    return null
  }
}
