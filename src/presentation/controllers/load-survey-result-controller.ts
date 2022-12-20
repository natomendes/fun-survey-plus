import { Controller, HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult } from '@/presentation/controllers/controllers-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId }
      } = httpRequest
      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      await this.loadSurveyResult.load(surveyId)

      return null
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
