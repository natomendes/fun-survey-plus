import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'valid_token'
    }
  }
  return new AuthenticationStub()
}

export const mockAuthenticationParams = (
  email = faker.internet.email(),
  password = faker.internet.password()
): AuthenticationParams => ({
  email,
  password
})
