import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveys } from '@/main/factories/usecases'
import { LoadSurveysController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
