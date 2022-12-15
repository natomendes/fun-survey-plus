import { DbAddAccount } from '@/data/usecases'
import { AccountMongoRepository, BcryptAdapter } from '@/infra'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
