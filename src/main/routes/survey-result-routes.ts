import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { userAuth } from '@/main/middlewares'
import { makeSaveSurveyResultController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', userAuth, adaptRoute(makeSaveSurveyResultController()))
}
