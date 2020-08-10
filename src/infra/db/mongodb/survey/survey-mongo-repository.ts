import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { MongoHelper } from "../helpers/mongo-helper"
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { SurveyModel } from "../../../../domain/models/survey";
// eslint-disable-next-line max-len
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await surveyCollection.insertOne(surveyData)

        return
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const surveys: SurveyModel[] = await surveyCollection.find().toArray()

        return surveys
    }

}