import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers'
import { makeSignUpValidation } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbAuthentication, makeDbAddAccount } from '@/main/factories/usecases'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
