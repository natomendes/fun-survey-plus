import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/db-add-account-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
