import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { AddSurveyModel, AddSurveyRepository } from '@/data/protocols'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(surveyData)
  }
}
