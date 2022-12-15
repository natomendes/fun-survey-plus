import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { AddAccountModel, AddSurveyModel } from '@/domain/usecases'
import { SurveyResultMongoRepository, MongoHelper } from '@/infra/db/mongodb'
import { SurveyResultModel } from '@/domain/models'

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

const makeFakeAddAccount = (): AddAccountModel => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeSurvey = async (addSurveyData = makeFakeAddSurveyData()): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(addSurveyData)
  return insertedId.toHexString()
}

const makeAccount = async (addAccountData = makeFakeAddAccount()): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(addAccountData)
  return insertedId.toHexString()
}

const makeFakeSurveyResult = (
  accountId = faker.database.mongodbObjectId(),
  surveyId = faker.database.mongodbObjectId()
): SurveyResultModel => ({
  id: faker.database.mongodbObjectId(),
  accountId,
  surveyId,
  answer: faker.random.word(),
  date: new Date()
})

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection
describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('Should add a survey result if its new', async () => {
      const accountId = await makeAccount()
      const surveyId = await makeSurvey()
      const sut = makeSut()
      const { id, ...saveSurveyResult } = makeFakeSurveyResult(accountId, surveyId)
      const surveyResult = await sut.saveResult(saveSurveyResult)
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.accountId).toBe(accountId)
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answer).toBe(saveSurveyResult.answer)
      expect(surveyResult.date).toEqual(saveSurveyResult.date)
    })
  })
})
