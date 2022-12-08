import { Collection } from 'mongodb'
import { MongoHelper } from '../../../../src/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from '../../../../src/infra/db/mongodb/log-repository'

const makeSut = (): LogMongoRepository => new LogMongoRepository()

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})