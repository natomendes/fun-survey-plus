import { HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { Authentication, AuthenticationModel } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return

    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return

    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
