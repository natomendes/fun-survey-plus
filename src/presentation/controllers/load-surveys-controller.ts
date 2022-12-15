import { Controller, HttpRequest, HttpResponse, LoadSurveys } from '@/presentation/controllers/controllers-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveysList = await this.loadSurveys.load()

      return surveysList.length ? ok(surveysList) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
