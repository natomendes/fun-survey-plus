import { Controller, HttpRequest, HttpResponse, LoadSurveys } from '@/presentation/controllers/controllers-protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveysList = await this.loadSurveys.load()

      return ok(surveysList)
    } catch (error) {
      return serverError(error)
    }
  }
}
