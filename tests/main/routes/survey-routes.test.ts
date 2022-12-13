import request from 'supertest'
import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import app from '@/main/config/app'
import { AddSurveyModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.datatype.string()
  }, {
    answer: faker.datatype.string()
  }]
})

let surveyCollection: Collection

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
  })

  describe('POST /surveys', () => {
    it('Should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeAddSurveyData())
        .expect(204)
    })
  })
})
