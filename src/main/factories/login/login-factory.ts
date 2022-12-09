import env from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorators'
import { makeLoginValidation } from '@/main/factories/login/login-validation-factory'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { LogMongoRepository } from '@/infra/db/mongodb/log-mongo-repository'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { DbAuthentication } from '@/data/usecases/authentication'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const salt = 12
  const encrypter = new JwtAdapter(env.jwtSecret)
  const hashComparer = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
