import { MongoHelper } from '@/infra'
import app from '@/main/config/app'
import { faker } from '@faker-js/faker'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { AddSurveyModel } from '@/domain/usecases'

const answer = faker.datatype.string()

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.datatype.string()
  }, {
    answer
  }],
  date: new Date()
})

const makeSurvey = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(makeFakeAddSurveyData())
  return insertedId.toHexString()
}

const makeAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Rodrigo',
    email: 'rodrigo.manguinho@gmail.com',
    password: '123',
    role
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
  return accessToken
}

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
