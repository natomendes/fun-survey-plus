import {
  AddAccountModel,
  AddAccount,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<boolean> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.hasher
      .hash(accountData.password)
    const isValid = await this.addAccountRepository
      .add({ ...accountData, password: hashedPassword })
    return isValid
  }
}
