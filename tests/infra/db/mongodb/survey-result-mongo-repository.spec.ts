import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'
import { SurveyResultMongoRepository, MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams, mockSurveyResult } from '@/tests/mocks'

const makeSurvey = async (addSurveyData = mockAddSurveyParams()): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(addSurveyData)
  return insertedId.toHexString()
}

const makeAccount = async (addAccountData = mockAddAccountParams()): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(addAccountData)
  return insertedId.toHexString()
}

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
      const { id, ...saveSurveyResult } = mockSurveyResult(accountId, surveyId)
      const surveyResult = await sut.saveResult(saveSurveyResult)
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.accountId).toBe(accountId)
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answer).toBe(saveSurveyResult.answer)
      expect(surveyResult.date).toEqual(saveSurveyResult.date)
    })

    it('Should update survey result if its not new', async () => {
      const accountId = await makeAccount()
      const surveyId = await makeSurvey()
      const { id, ...saveSurveyResult } = mockSurveyResult(accountId, surveyId)
      const { insertedId } = await surveyResultCollection.insertOne(saveSurveyResult)
      const newAnswer = faker.datatype.string()
      saveSurveyResult.answer = newAnswer
      const sut = makeSut()
      const surveyResult = await sut.saveResult(saveSurveyResult)
      expect(surveyResult.id).toBe(insertedId.toHexString())
      expect(surveyResult.accountId).toBe(accountId)
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answer).toBe(newAnswer)
      expect(surveyResult.date).toEqual(saveSurveyResult.date)
    })
  })
})
