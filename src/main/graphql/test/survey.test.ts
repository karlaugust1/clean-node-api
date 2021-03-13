/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection } from "mongodb"
import { MongoHelper } from "../../../infra/db/mongodb/helpers"
import env from "../../config/env"
import { createTestClient } from "apollo-server-integration-testing"
import { ApolloServer, gql } from "apollo-server-express"
import { makeApolloServer } from "./helpers"
import { sign } from "jsonwebtoken"

let surveyCollection: Collection
let accountCollection: Collection

let apolloServer: ApolloServer

const makeAccessToken = async (): Promise<string> => {
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

    return accessToken
}

describe("Survey GraphQL", () => {
    beforeAll(async () => {
        apolloServer = makeApolloServer()
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
    describe("Surveys Query", () => {
        const surveysQuery = gql`
            query surveys {
                surveys {
                    id
                    question,
                    answers {
                        image
                        answer
                    },
                    date,
                    didAnswer
                }
            }
        `
        test("Should return Surveys", async () => {
            const accessToken = await makeAccessToken()
            const now = new Date()
            await surveyCollection.insertOne({
                question: "any_question",
                answers: [{
                    answer: "Answer 1",
                    image: "http://image-name.com"
                }, {
                    answer: "Answer 2"
                }],
                date: now
            })
            const { query } = createTestClient({
                apolloServer,
                extendMockRequest: {
                    headers: {
                        "x-access-token": accessToken
                    }
                }
            })
            const res: any = await query(surveysQuery)
            expect(res.data.surveys.length).toBe(1)
            expect(res.data.surveys[0].id).toBeTruthy()
            expect(res.data.surveys[0].question).toBe("any_question")
            expect(res.data.surveys[0].date).toBe(now.toISOString())
            expect(res.data.surveys[0].didAnswer).toBe(false)
            expect(res.data.surveys[0].answers).toEqual([{
                answer: "Answer 1",
                image: "http://image-name.com"
            }, {
                answer: "Answer 2",
                image: null
            }])
        })
    })
})
