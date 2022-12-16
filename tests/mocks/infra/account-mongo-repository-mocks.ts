import { AccountModel, AddAccountParams, AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_account: AddAccountParams): Promise<boolean> {
      return true
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (accountModel = null): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (_email: string): Promise<AccountModel> {
      return accountModel
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (_userId: string, _token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (account: AccountModel): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (_token: string, _role?: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
