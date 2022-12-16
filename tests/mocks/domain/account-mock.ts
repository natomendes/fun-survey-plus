import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAccount = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
