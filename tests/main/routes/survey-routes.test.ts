import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra'

const makeFakeAddSurveyData = (): any => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.datatype.string()
  }, {
    answer: faker.datatype.string()
  }]
})

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeAddSurveyData())
        .expect(403)
    })

    it('Should return 204 on add survey with valid access token', async () => {
      const res = await accountCollection.insertOne({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.insertedId.toHexString()
      const accessToken = sign({ id }, process.env.JWT_SECRET)
      await accountCollection.updateOne({
        _id: res.insertedId
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeAddSurveyData())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('Should return 403 on load surveys without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('Should return 204 on load all surveys with valid access token', async () => {
      const res = await accountCollection.insertOne({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho@gmail.com',
        password: '123'
      })
      const id = res.insertedId.toHexString()
      const accessToken = sign({ id }, process.env.JWT_SECRET)
      await accountCollection.updateOne({
        _id: res.insertedId
      }, {
        $set: {
          accessToken
        }
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
