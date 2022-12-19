import { badRequest, unauthorized, serverError, notFound, forbidden } from '@/main/docs/components/'
import { apiKeyAuthSchema } from '@/main/docs/schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
}
