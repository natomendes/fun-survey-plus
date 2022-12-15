import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { AddSurveyModel, AddSurveyRepository, LoadSurveysRepository, SurveyModel } from '@/data/protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return MongoHelper.mapCollection<SurveyModel>(surveys)
  }
}
