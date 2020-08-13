import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyMongoRepository } from "./survey-mongo-repository"
import { Collection } from "mongodb"

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

let surveyCollection: Collection

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
    })

    describe("add()", () => {
        test("Should return add a survey on add success", async () => {
            const sut = makeSut()
            await sut.add({
                question: "any_question",
                answers: [{
                    image: "any_image",
                    answer: "any_answer"
                }, {
                    answer: "other_answer"
                }],
                date: new Date()
            })
            const survey = await surveyCollection.findOne({ question: "any_question" })
            expect(survey).toBeTruthy()
        })
    })
    describe("loadAll()", () => {
        test("Should load all surveys on success", async () => {
            await surveyCollection.insertMany([{
                question: "any_question",
                answers: [{
                    image: "any_image",
                    answer: "any_answer"
                }],
                date: new Date()
            }, {
                question: "other_question",
                answers: [{
                    image: "other_image",
                    answer: "other_answer"
                }],
                date: new Date()
            }])
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0].id).toBeTruthy()
            expect(surveys[0].question).toEqual("any_question")
            expect(surveys[1].question).toEqual("other_question")
        })
        test("Should load empty list", async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })

    describe("loadById()", () => {
        test("Should load a survey by id on success", async () => {
            const res = await surveyCollection.insertOne({
                question: "any_question",
                answers: [{
                    image: "any_image",
                    answer: "any_answer"
                }],
                date: new Date()
            })
            const sut = makeSut()
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const survey = await sut.loadById(res.ops[0]._id)
            expect(survey).toBeTruthy()
            expect(survey.id).toBeTruthy()
        })
        test("Should load empty list", async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })
})
