import { ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AddAccountModel, AccountModel } from '@/data/protocols'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<boolean> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const { acknowledged } = await accountCollection.insertOne(accountData)

    return acknowledged
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account && MongoHelper.map<AccountModel>(account)
  }

  async updateAccessToken (userId: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
