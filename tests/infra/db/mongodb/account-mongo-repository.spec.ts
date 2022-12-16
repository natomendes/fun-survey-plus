import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { mockAddAccountParams } from '@/tests/mocks'
import { Collection } from 'mongodb'

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

  describe('add()', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      const isValid = await sut.add(mockAddAccountParams())
      expect(isValid).toBe(true)
    })
  })

  describe('loadByEmail()', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      const addAccount = mockAddAccountParams()
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByEmail(addAccount.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccount.name)
      expect(account.email).toBe(addAccount.email)
      expect(account.password).toBe(addAccount.password)
    })

    it('Should return null if mongo findOne fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    it('Should update account accessToken on success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
      let account = await accountCollection.findOne({ _id: insertedId })
      expect(account.accessToken).toBeFalsy()

      await sut.updateAccessToken(account._id.toHexString(), 'any_token')
      account = await accountCollection.findOne({ _id: insertedId })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    it('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const addAccount = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByToken(addAccount.accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccount.name)
      expect(account.email).toBe(addAccount.email)
      expect(account.password).toBe(addAccount.password)
    })

    it('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const addAccount = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      }
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByToken(addAccount.accessToken, addAccount.role)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccount.name)
      expect(account.email).toBe(addAccount.email)
      expect(account.password).toBe(addAccount.password)
    })

    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const addAccount = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByToken(addAccount.accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    it('Should return null if mongo findOne fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })

    it('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const addAccount = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      }
      await accountCollection.insertOne(addAccount)
      const account = await sut.loadByToken(addAccount.accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccount.name)
      expect(account.email).toBe(addAccount.email)
      expect(account.password).toBe(addAccount.password)
    })
  })
})
