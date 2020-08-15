import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/usecases/survey/add-survey";
import { MongoHelper } from "../helpers/mongo-helper"
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { LoadSurveyByIdRepository } from "../../../../data/protocols/db/survey/load-survey-by-id-repository";
import { ObjectId } from "mongodb";
// eslint-disable-next-line max-len
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.insertOne(surveyData)

        return
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        const surveys: SurveyModel[] = await surveyCollection.find().toArray()

        return MongoHelper.mapCollection(surveys) as SurveyModel[]
    }

    async loadById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

        return survey && MongoHelper.map(survey) as SurveyModel
    }

}