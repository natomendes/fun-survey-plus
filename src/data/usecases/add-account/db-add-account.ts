import {
  AddAccountModel,
  AddAccount,
  AccountModel,
  Encrypter,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter
      .encrypt(accountData.password)
    const account = await this.addAccountRepository
      .add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
