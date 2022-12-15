import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'
import { makeDbAuthentication } from '@/main/factories/usecases'
import { makeLoginValidation } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
