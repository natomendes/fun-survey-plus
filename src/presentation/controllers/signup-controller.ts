import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
