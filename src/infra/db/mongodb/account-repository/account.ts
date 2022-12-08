import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<boolean> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const { insertedId } = await accountCollection.insertOne(accountData)

    return insertedId !== null
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account && MongoHelper.map<AccountModel>(account)
  }
}
