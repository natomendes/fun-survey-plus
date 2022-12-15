import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/protocols'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async saveResult (surveyResultData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection.findOneAndUpdate({
      surveyId: surveyResultData.surveyId,
      accountId: surveyResultData.accountId
    }, {
      $set: {
        answer: surveyResultData.answer,
        date: surveyResultData.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })

    return MongoHelper.map<SurveyResultModel>(surveyResult.value)
  }

  private async loadById (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection.findOne({ _id: new ObjectId(surveyId) })

    return MongoHelper.map<SurveyResultModel>(surveyResult)
  }
}