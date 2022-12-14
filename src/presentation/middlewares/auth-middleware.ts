import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http-helper'
import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from '@/presentation/middlewares/middlewares-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) return ok({ accountId: account.id })
    }

    return forbidden(new AccessDeniedError())
  }
}
