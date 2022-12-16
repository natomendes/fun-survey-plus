import express from 'express'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupSwagger from '@/main/config/swagger'

const app = express()
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
