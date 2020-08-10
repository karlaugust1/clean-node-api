import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"
import { sign } from "jsonwebtoken"
import env from "../config/env"

let surveyCollection: Collection
let accountCollection: Collection

describe("Survey Routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection("surveys")
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("POST /surveys", () => {
        test("Shoud return 403 on add survey without accessToken", async () => {
            await request(app)
                .post("/api/surveys")
                .send({
                    question: "any_question",
                    answers: [{
                        answer: "Answer 1",
                        image: "http://image-name.com"
                    }, {
                        answer: "Answer 2"
                    }]
                })
                .expect(403)
        })

        test("Shoud return 204 on add survey with valid accessToken", async () => {
            const result = await accountCollection.insertOne({
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                role: "admin"
            })
            const id = result.ops[0]._id
            const accessToken = sign({ id }, env.jwtSecret)
            await accountCollection.updateOne({
                _id: id
            }, {
                $set: {
                    accessToken
                }
            })

            await request(app)
                .post("/api/surveys")
                .set("x-access-token", accessToken)
                .send({
                    question: "any_question",
                    answers: [{
                        answer: "Answer 1",
                        image: "http://image-name.com"
                    }, {
                        answer: "Answer 2"
                    }]
                })
                .expect(204)
        })
    })
    describe("GET /surveys", () => {
        test("Shoud return 403 on load surveys without accessToken", async () => {
            await request(app)
                .get("/api/surveys")
                .expect(403)
        })
    })
})

