import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from '@/presentation/controllers/controllers-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId } } = httpRequest

      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
