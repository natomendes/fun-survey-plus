import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http-helper'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

describe('Auth Middleware', () => {
  it('Should return forbidden if no x-access-token existis in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
