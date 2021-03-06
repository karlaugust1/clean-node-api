import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository"
import { Collection, ObjectId } from "mongodb"
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
            answer: "any_answer_1"
        }, {
            answer: "any_answer_2"
        }, {
            answer: "any_answer_3"
        }],
        date: new Date()
    })

    return MongoHelper.map(res.ops[0]) as SurveyModel
}

const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password"
    })

    return MongoHelper.map(res.ops[0]) as AccountModel
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
        surveyResultCollection = await MongoHelper.getCollection("surveyResults")
        await surveyResultCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("save()", () => {
        test("Should return add a survey result if its new", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[0].answer,
                date: new Date()
            })
            const surveyResult = await surveyResultCollection.findOne({
                surveyId: survey.id,
                accountId: account.id
            })
            expect(surveyResult).toBeTruthy()
        })
        test("Should update a survey result if it is not new", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            await surveyResultCollection.insertOne({
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            })
            await sut.save({
                surveyId: survey.id,
                accountId: account.id,
                answer: survey.answers[1].answer,
                date: new Date()
            })
            const surveyResult = await surveyResultCollection.find({
                surveyId: survey.id,
                accountId: account.id
            }).toArray()

            expect(surveyResult).toBeTruthy()
            expect(surveyResult.length).toBe(1)
        })
    })

    describe("loadBySurveyId()", () => {
        test("Should load survey result", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            await surveyResultCollection.insertMany([{
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[1].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account.id),
                answer: survey.answers[1].answer,
                date: new Date()
            }])

            const saveResult = await sut.loadBySurveyId(survey.id)
            expect(saveResult).toBeTruthy()
            expect(saveResult.surveyId).toEqual(survey.id)
            expect(saveResult.answers[0].count).toBe(2)
            expect(saveResult.answers[0].percent).toBe(50)
            expect(saveResult.answers[1].count).toBe(2)
            expect(saveResult.answers[1].percent).toBe(50)
            expect(saveResult.answers[2].count).toBe(0)
            expect(saveResult.answers[2].percent).toBe(0)
        })

        test("Should return null if there is no survey result", async () => {
            const survey = await makeSurvey()
            const sut = makeSut()
            const surveyResult = await sut.loadBySurveyId(survey.id)
            expect(surveyResult).toBeNull()
        })
    })
})