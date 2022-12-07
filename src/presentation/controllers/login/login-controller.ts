import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { Controller, HttpRequest, HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) return badRequest(new InvalidParamError('email'))

    return ok('test')
  }
}
