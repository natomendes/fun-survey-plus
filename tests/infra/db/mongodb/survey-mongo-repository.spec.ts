import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { AddSurveyModel } from '@/domain/usecases'
import { SurveyMongoRepository, MongoHelper } from '@/infra/db/mongodb'

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: faker.random.words(),
  answers: [{
    image: faker.datatype.string(),
    answer: faker.datatype.string()
  }, {
    answer: faker.datatype.string()
  }],
  date: new Date()
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
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

  describe('Add method', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()
      const addSurveyData = makeFakeAddSurveyData()
      await sut.add(addSurveyData)
      const survey = await surveyCollection.findOne({ question: addSurveyData.question })
      expect(survey).toBeTruthy()
    })
  })
})
