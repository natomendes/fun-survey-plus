import * as Schemas from '@/main/docs/schemas/'

export default {
  account: Schemas.accountSchema,
  loginParams: Schemas.loginParamsSchema,
  signUpParams: Schemas.signUpParamsSchema,
  error: Schemas.errorSchema,
  survey: Schemas.surveySchema,
  surveys: Schemas.surveysSchema,
  surveyAnswer: Schemas.surveyAnswerSchema,
  addSurveyParams: Schemas.addSurveyParamsSchema,
  saveSurveyResultParams: Schemas.saveSurveyResultParamsSchema,
  saveSurveyResult: Schemas.saveSurveyResultSchema,
  surveyResultAnswer: Schemas.surveyResultAnswerSchema
}
