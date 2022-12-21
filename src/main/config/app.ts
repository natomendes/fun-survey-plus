import express from 'express'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupSwagger from '@/main/config/swagger'

const app = express()
app.get('/', async (_req, res) => {
  res.redirect('docs')
})
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
