import env from '@/main/config/env'
import { DbLoadAccountByToken } from '@/data/usecases'
import { LoadAccountByToken } from '@/domain/usecases'
import { JwtAdapter, AccountMongoRepository } from '@/infra'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, loadAccountByTokenRepository)
}
