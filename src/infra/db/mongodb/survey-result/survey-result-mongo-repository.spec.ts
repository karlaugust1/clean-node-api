import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository"
import { Collection } from "mongodb"
import { SurveyModel } from "../../../../domain/models/survey"
import { AccountModel } from "../../../../domain/models/account"

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
        question: "any_question",
        answers: [{
            image: "any_image",
            answer: "any_answer"
        }, {
            answer: "other_answer"
        }],
        date: new Date()
    })

    return res.ops[0] as SurveyModel
}

const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password"
    })

    return res.ops[0] as AccountModel
}

describe("Survey Mongo Repository", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.deleteMany({})
        surveyResultCollection = await MongoHelper.getCollection("surveysResults")
        await surveyResultCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("save()", () => {
        test("Should return add a survey result if its new", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            const saveResult = await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date()
            })
            expect(saveResult).toBeTruthy()
            expect(saveResult.id).toBeTruthy()
            expect(saveResult.answer).toBe(survey.answers[0].answer)
        })
    })
})