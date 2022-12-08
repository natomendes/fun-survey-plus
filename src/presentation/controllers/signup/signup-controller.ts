import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from '@/presentation/controllers/signup/signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      const accountIsValid = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(accountIsValid)
    } catch (error) {
      return serverError(error)
    }
  }
}
