import { MongoHelper } from '@/infra'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import request from 'supertest'
import { makeAccessToken, makeSurvey, mockAnswer } from '@/tests/mocks'

const answer = mockAnswer

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

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    it('Should return 200 on save survey with valid access token', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await makeSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer
        })
        .expect(200)
    })
  })
})
