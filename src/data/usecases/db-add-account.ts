import {
  AddAccountModel,
  AddAccount,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '@/data/usecases/usecases-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<boolean> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account) return false

    const hashedPassword = await this.hasher
      .hash(accountData.password)
    const acknowledged = await this.addAccountRepository
      .add({ ...accountData, password: hashedPassword })
    return acknowledged
  }
}
