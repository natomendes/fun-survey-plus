import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams, LoadAccountByToken } from '@/domain/usecases'
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

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (_account: AddAccountParams): Promise<boolean> {
      return true
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (account: AccountModel): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (_accessToken: string, _role?: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByTokenStub()
}
