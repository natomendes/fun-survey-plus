import swaggerConfig from '@/main/docs'
import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache } from '@/main/middlewares/no-cache'

export default (app: Express): void => {
  app.use('/documentation', noCache, serve, setup(swaggerConfig))
}
