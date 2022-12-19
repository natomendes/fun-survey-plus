import { loginPath, signUpPath } from '@/main/docs/paths'
import { accountSchema, errorSchema, loginParamsSchema, signUpParamsSchema } from '@/main/docs/schemas'
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
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}
