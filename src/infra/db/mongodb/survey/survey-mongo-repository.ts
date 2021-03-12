import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { MongoHelper, QueryBuilder } from "../helpers"
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import { LoadSurveyByIdRepository } from "../../../../data/protocols/db/survey/load-survey-by-id-repository";
import { ObjectId } from "mongodb";
import { LoadAnswersBySurveyRepository } from "../../../../data/protocols/db/survey/load-answers-by-survey-repository";
// eslint-disable-next-line max-len
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, LoadAnswersBySurveyRepository {

    async add(surveyData: AddSurveyRepository.Params): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.insertOne(surveyData)

        return
    }

    async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
        const surveyCollection = await MongoHelper.getCollection("surveys")

        const query = new QueryBuilder()
            .lookup({
                from: "surveyResults",
                foreignField: "surveyId",
                localField: "_id",
                as: "result"
            })
            .project({
                _id: 1,
                question: 1,
                answers: 1,
                date: 1,
                didAnswer: {
                    $gte: [{
                        $size: {
                            $filter: {
                                input: "$result",
                                as: "item",
                                cond: {
                                    $eq: ["$$item.accountId", new ObjectId(accountId)]
                                }
                            }
                        }
                    }, 1]
                }
            })
            .build()

        const surveys: LoadSurveysRepository.Result[] = await surveyCollection.aggregate(query).toArray()

        return MongoHelper.mapCollection(surveys) as LoadSurveysRepository.Result
    }

    async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

        return survey && MongoHelper.map(survey) as LoadSurveyByIdRepository.Result
    }

    async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
        const surveyCollection = await MongoHelper.getCollection("surveys")
        const query = new QueryBuilder()
            .match({
                _id: new ObjectId(id)
            })
            .project({
                _id: 0,
                answers: "$answers.answer"
            })
            .build()
        const surveys = await surveyCollection.aggregate(query).toArray()

        return surveys[0]?.answers as LoadAnswersBySurveyRepository.Result || []
    }

}