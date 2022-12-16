import { SurveyMongoRepository, MongoHelper } from '@/infra/db/mongodb'
import { mockAddSurveyParams } from '@/tests/mocks'
import { Collection } from 'mongodb'

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

  describe('add()', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()
      const addSurveyData = mockAddSurveyParams()
      await sut.add(addSurveyData)
      const survey = await surveyCollection.findOne({ question: addSurveyData.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      const addSurveyData = mockAddSurveyParams()
      const addSurveyData2 = mockAddSurveyParams()
      await surveyCollection.insertMany([addSurveyData, addSurveyData2])

      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyData.question)
      expect(surveys[1].question).toBe(addSurveyData2.question)
    })

    it('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('Should load a surveys by id on success', async () => {
      const addSurveyData = mockAddSurveyParams()
      const { insertedId } = await surveyCollection.insertOne(addSurveyData)

      const sut = makeSut()
      const survey = await sut.loadById(insertedId.toHexString())
      expect(survey.id).toBe(insertedId.toHexString())
      expect(survey.question).toBe(addSurveyData.question)
      expect(survey.answers).toEqual(addSurveyData.answers)
      expect(survey.date).toEqual(addSurveyData.date)
    })
  })
})
