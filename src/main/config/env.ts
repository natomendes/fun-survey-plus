export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/api-db',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'teste_secret'
}
