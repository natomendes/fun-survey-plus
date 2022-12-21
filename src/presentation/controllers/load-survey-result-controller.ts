import { Controller, HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult } from '@/presentation/controllers/controllers-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, accountId } = httpRequest
      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)

      return ok(surveyResult)
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
