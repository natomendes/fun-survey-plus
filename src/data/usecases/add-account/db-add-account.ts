import { AddAccountModel, AddAccount, AccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(null))
  }
}
