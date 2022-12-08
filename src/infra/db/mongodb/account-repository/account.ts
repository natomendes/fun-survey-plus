import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<boolean> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const { insertedId } = await accountCollection.insertOne(accountData)

    return insertedId !== null
  }
}
