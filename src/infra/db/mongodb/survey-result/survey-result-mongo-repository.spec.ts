import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository"
import { Collection, ObjectId } from "mongodb"
import { SurveyModel } from "../../../../domain/models/survey"

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

const mockAccountId = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password"
    })

    return res.ops[0]._id as string
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
            const accountId = await mockAccountId()
            await sut.save({
                surveyId: survey.id,
                accountId,
                answer: survey.answers[0].answer,
                date: new Date()
            })
            const surveyResult = await surveyResultCollection.findOne({
                surveyId: survey.id,
                accountId
            })
            expect(surveyResult).toBeTruthy()
        })
        test("Should update a survey result if it is not new", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const accountId = await mockAccountId()
            await surveyResultCollection.insertOne({
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId),
                answer: survey.answers[0].answer,
                date: new Date()
            })
            await sut.save({
                surveyId: survey.id,
                accountId,
                answer: survey.answers[1].answer,
                date: new Date()
            })
            const surveyResult = await surveyResultCollection.find({
                surveyId: survey.id,
                accountId
            }).toArray()

            expect(surveyResult).toBeTruthy()
            expect(surveyResult.length).toBe(1)
        })
    })

    describe("loadBySurveyId()", () => {
        test("Should load survey result", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const accountId = await mockAccountId()
            const accountId2 = await mockAccountId()
            await surveyResultCollection.insertMany([{
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId2),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId2),
                answer: survey.answers[1].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId2),
                answer: survey.answers[1].answer,
                date: new Date()
            }])

            const saveResult = await sut.loadBySurveyId(survey.id, accountId)
            expect(saveResult).toBeTruthy()
            expect(saveResult.surveyId).toEqual(survey.id)
            expect(saveResult.answers[0].count).toBe(2)
            expect(saveResult.answers[0].percent).toBe(50)
            expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(true)
            expect(saveResult.answers[1].count).toBe(2)
            expect(saveResult.answers[1].percent).toBe(50)
            expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
            expect(saveResult.answers[2].count).toBe(0)
            expect(saveResult.answers[2].percent).toBe(0)
        })

        test("Should load survey result 2", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const accountId = await mockAccountId()
            const accountId2 = await mockAccountId()
            const accountId3 = await mockAccountId()
            await surveyResultCollection.insertMany([{
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId2),
                answer: survey.answers[1].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(accountId3),
                answer: survey.answers[1].answer,
                date: new Date()
            }])

            const saveResult = await sut.loadBySurveyId(survey.id, accountId2)
            expect(saveResult).toBeTruthy()
            expect(saveResult.surveyId).toEqual(survey.id)
            expect(saveResult.answers[0].count).toBe(2)
            expect(saveResult.answers[0].percent).toBe(67)
            expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(true)
            expect(saveResult.answers[1].count).toBe(1)
            expect(saveResult.answers[1].percent).toBe(33)
            expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
        })

        test("Should load survey result 3", async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await mockAccountId()
            const account2 = await mockAccountId()
            const account3 = await mockAccountId()
            await surveyResultCollection.insertMany([{
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account),
                answer: survey.answers[0].answer,
                date: new Date()
            }, {
                surveyId: new ObjectId(survey.id),
                accountId: new ObjectId(account2),
                answer: survey.answers[1].answer,
                date: new Date()
            }])

            const saveResult = await sut.loadBySurveyId(survey.id, account3)
            expect(saveResult).toBeTruthy()
            expect(saveResult.surveyId).toEqual(survey.id)
            expect(saveResult.answers[0].count).toBe(1)
            expect(saveResult.answers[0].percent).toBe(50)
            expect(saveResult.answers[0].isCurrentAccountAnswer).toBe(false)
            expect(saveResult.answers[1].count).toBe(1)
            expect(saveResult.answers[1].percent).toBe(50)
            expect(saveResult.answers[1].isCurrentAccountAnswer).toBe(false)
        })

        test("Should return null if there is no survey result", async () => {
            const survey = await makeSurvey()
            const accountId = await mockAccountId()
            const sut = makeSut()
            const surveyResult = await sut.loadBySurveyId(survey.id, accountId)
            expect(surveyResult).toBeNull()
        })
    })
})