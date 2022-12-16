import request from 'supertest'
import { Collection } from 'mongodb'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra'
import { makeAddSurveyRequest, makeAccessToken } from '@/tests/mocks'

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
        .send(makeAddSurveyRequest())
        .expect(403)
    })

    it('Should return 204 on add survey with valid access token', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeAddSurveyRequest())
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
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
