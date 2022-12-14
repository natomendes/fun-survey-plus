import { AccountModel, Decrypter, LoadAccountByToken } from '@/data/usecases/usecases-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)

    return null
  }
}
