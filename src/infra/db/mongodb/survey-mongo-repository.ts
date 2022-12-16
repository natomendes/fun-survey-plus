import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { AddSurveyParams, AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository, SurveyModel } from '@/data/protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return MongoHelper.mapCollection<SurveyModel>(surveys)
  }

  async loadById (surveyId: string): Promise<SurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(surveyId) })

    return survey && MongoHelper.map<SurveyModel>(survey)
  }
}
