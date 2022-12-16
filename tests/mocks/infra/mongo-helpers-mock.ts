import { MongoHelper } from '@/infra'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { mockAddSurveyParams } from '@/tests/mocks'

let accountCollection: Collection
let surveyCollection: Collection

export const makeAccessToken = async (role?: string): Promise<string> => {
  accountCollection = MongoHelper.getCollection('accounts')
  const res = await accountCollection.insertOne({
    name: 'Rodrigo',
    email: 'rodrigo.manguinho@gmail.com',
    password: '123',
    role
  })
  const id = res.insertedId.toHexString()
  const accessToken = sign({ id }, process.env.JWT_SECRET)
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

export const makeSurvey = async (): Promise<string> => {
  surveyCollection = MongoHelper.getCollection('surveys')
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
  return insertedId.toHexString()
}
