import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/controllers/add-survey/add-survey-protocols'
import { badRequest } from '@/presentation/helpers/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    return null
  }
}
