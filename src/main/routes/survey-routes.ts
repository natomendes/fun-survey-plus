import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { adminAuth, userAuth } from '@/main/middlewares'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveysController()))
}
