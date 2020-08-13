import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { MongoHelper } from "../helpers/mongo-helper"
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { LoadSurveyByIdRepository } from "../../../../data/protocols/db/survey/load-survey-by-id-repository";
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

        return surveys
    }

    async loadById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        const surveys: SurveyModel = await surveyCollection.findOne({ _id: id })

        return surveys
    }

}