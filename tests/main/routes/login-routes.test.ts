import { hash } from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@mail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: '123456'
        })
        .expect(200)
    })

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: '123456'
        })
        .expect(401)
    })
  })
})
