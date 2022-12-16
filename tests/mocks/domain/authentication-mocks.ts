import { AuthenticationParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAuthenticationParams = (
  email = faker.internet.email(),
  password = faker.internet.password()
): AuthenticationParams => ({
  email,
  password
})
