import { Controller, HttpRequest, HttpResponse, LoadSurveys } from '@/presentation/controllers/controllers-protocols'
import { ok } from '@/presentation/helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveysList = await this.loadSurveys.load()

    return ok(surveysList)
  }
}
