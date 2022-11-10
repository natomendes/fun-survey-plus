import { AddAccountModel, AddAccount } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(null))
  }
}
