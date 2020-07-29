import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { MongoHelper } from "../helpers/mongo-helper"
// eslint-disable-next-line max-len
export class SurveyMongoRepository implements AddSurveyRepository {

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await surveyCollection.insertOne(surveyData)

        return
    }

}