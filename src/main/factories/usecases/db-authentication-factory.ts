import env from '@/main/config/env'
import { DbAuthentication } from '@/data/usecases'
import { JwtAdapter, BcryptAdapter, AccountMongoRepository } from '@/infra'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const encrypter = new JwtAdapter(env.jwtSecret)
  const hashComparer = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )
}
