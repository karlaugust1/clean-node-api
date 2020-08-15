import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"
import { sign } from "jsonwebtoken"
import env from "../config/env"

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
    const result = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
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

    return accessToken
}

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

    describe("PUT /surveys/:surveyId/results", () => {
        test("Shoud return 403 on save survey result without accessToken", async () => {
            await request(app)
                .put("/api/surveys/any_id/results")
                .send({
                    answer: "any_answer"
                })
                .expect(403)
        })
        test("Shoud return 200 on save survey result with accessToken", async () => {
            const accessToken = await makeAccessToken()
            const res = await surveyCollection.insertOne({
                question: "any_question",
                answers: [{
                    answer: "Answer 1",
                    image: "http://image-name.com"
                }, {
                    answer: "Answer 2"
                }]
            })
            await request(app)
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                .put(`/api/surveys/${res.ops[0]._id}/results`)
                .set("x-access-token", accessToken)
                .send({
                    answer: "Answer 1"
                })
                .expect(200)
        })
    })
})

