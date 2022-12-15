import { Router } from 'express'
import { adaptRoute, adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/surveys', adaptMiddleware(makeAuthMiddleware('admin')), adaptRoute(makeAddSurveyController()))
  router.get('/surveys', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeLoadSurveysController()))
}
