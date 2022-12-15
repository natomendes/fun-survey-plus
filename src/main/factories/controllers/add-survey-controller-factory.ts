import { Controller } from '@/presentation/protocols'
import { makeDbAddSurvey } from '@/main/factories/usecases'
import { AddSurveyController } from '@/presentation/controllers'
import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
