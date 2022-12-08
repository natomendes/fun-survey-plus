import { HashComparer, LoadAccountByEmailRepository, TokenGenerator } from '@/data/protocols'
import { Authentication, AuthenticationModel } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return

    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return

    return await this.tokenGenerator.generate(account.id)
  }
}
