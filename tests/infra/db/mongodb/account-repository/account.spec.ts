import { AddAccountModel } from '@/domain/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository/account'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Add method', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      const isValid = await sut.add(makeFakeAddAccount())
      expect(isValid).toBe(true)
    })
  })

  describe('loadByEmail method', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccount = makeFakeAddAccount()
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByEmail(addAccount.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccount.name)
      expect(account.email).toBe(addAccount.email)
      expect(account.password).toBe(addAccount.password)
    })

    it('Should return falsy if mongo findOne fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken method', () => {
    it('Should update account accessToken on success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(makeFakeAddAccount())
      let account = await accountCollection.findOne({ _id: insertedId })
      expect(account.accessToken).toBeFalsy()

      await sut.updateAccessToken(account._id.toHexString(), 'any_token')
      account = await accountCollection.findOne({ _id: insertedId })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })
})
