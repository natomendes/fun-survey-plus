import env from '@/main/config/env'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { DbAuthentication } from '@/data/usecases/authentication'

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
