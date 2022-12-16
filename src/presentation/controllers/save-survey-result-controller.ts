import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from '@/presentation/controllers/controllers-protocols'
import { forbidden, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
        body: { answer },
        accountId
      } = httpRequest

      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      if (!survey.answers.some(a => a.answer === answer)) return forbidden(new InvalidParamError('answer'))

      await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
