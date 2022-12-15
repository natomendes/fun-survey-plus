import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from '@/presentation/controllers/controllers-protocols'
import { forbidden } from '@/presentation/helpers/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params: { surveyId } } = httpRequest

    const survey = await this.loadSurveyById.load(surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
  }
}
