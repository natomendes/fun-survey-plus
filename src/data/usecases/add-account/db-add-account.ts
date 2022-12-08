import {
  AddAccountModel,
  AddAccount,
  Hasher,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<boolean> {
    const hashedPassword = await this.hasher
      .hash(accountData.password)
    const isValid = await this.addAccountRepository
      .add({ ...accountData, password: hashedPassword })
    return isValid
  }
}
