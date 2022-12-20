import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository, MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams, mockAnswer, mockSaveSurveyResultParams } from '@/tests/mocks'

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
      const saveSurveyResultParams = mockSaveSurveyResultParams(surveyId, accountId)
      const surveyResult = await sut.saveResult(saveSurveyResultParams)
      expect(surveyResult.surveyId).toEqual(new ObjectId(surveyId))
      expect(surveyResult.answers[0].answer).toBe(mockAnswer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })

    it('Should update survey result if its not new', async () => {
      const accountId = await makeAccount()
      const surveyId = await makeSurvey()
      const survey = await surveyCollection.findOne({ _id: new ObjectId(surveyId) })
      const saveSurveyResultParams = mockSaveSurveyResultParams(surveyId, accountId, survey.answers[0].answer)
      const sut = makeSut()
      const surveyResult = await sut.saveResult(saveSurveyResultParams)
      expect(surveyResult.surveyId).toEqual(new ObjectId(surveyId))
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
  })
})
