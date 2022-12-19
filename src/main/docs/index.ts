import { loginPath, signUpPath, surveyPath, surveyResultPath } from '@/main/docs/paths'
import * as Schemas from '@/main/docs/schemas'
import { badRequest, unauthorized, serverError, notFound, forbidden } from '@/main/docs/components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Fun Survey Plus',
    description: 'Fun Survey PLus, Node API using TDD, Clean Architecture and Typescript',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Survey'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: Schemas.accountSchema,
    loginParams: Schemas.loginParamsSchema,
    signUpParams: Schemas.signUpParamsSchema,
    error: Schemas.errorSchema,
    survey: Schemas.surveySchema,
    surveys: Schemas.surveysSchema,
    surveyAnswer: Schemas.surveyAnswerSchema,
    addSurveyParams: Schemas.addSurveyParamsSchema,
    saveSurveyResultParams: Schemas.saveSurveyResultParamsSchema,
    saveSurveyResult: Schemas.saveSurveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: Schemas.apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}
