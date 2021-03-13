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

describe("SurveyResult GraphQL", () => {
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
    describe("SurveysResult Query", () => {
        const surveyResultQuery = gql`
            query surveyResult($surveyId: String!) {
                surveyResult(surveyId: $surveyId) {
                    question,
                    answers {
                        answer
                        count,
                        percent,
                        isCurrentAccountAnswer
                    },
                    date,
                }
            }
        `
        test("Should return SurveyResult", async () => {
            const accessToken = await makeAccessToken()
            const now = new Date()
            const surveyRes = await surveyCollection.insertOne({
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
            const res: any = await query(surveyResultQuery, {
                variables: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    surveyId: surveyRes.ops[0]._id.toString()
                }
            })
            expect(res.data.surveyResult.question).toBe("any_question")
            expect(res.data.surveyResult.date).toBe(now.toISOString())
            expect(res.data.surveyResult.answers).toEqual([{
                answer: "Answer 1",
                count: 0,
                percent: 0,
                isCurrentAccountAnswer: false
            }, {
                answer: "Answer 2",
                count: 0,
                percent: 0,
                isCurrentAccountAnswer: false
            }])
        })
        test("Should return AccessDeniedError if no token is provided", async () => {
            const now = new Date()
            const surveyRes = await surveyCollection.insertOne({
                question: "any_question",
                answers: [{
                    answer: "Answer 1",
                    image: "http://image-name.com"
                }, {
                    answer: "Answer 2"
                }],
                date: now
            })
            const { query } = createTestClient({ apolloServer })
            const res: any = await query(surveyResultQuery, {
                variables: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    surveyId: surveyRes.ops[0]._id.toString()
                }
            })
            expect(res.data).toBeFalsy()
            expect(res.errors[0].message).toBe("Access denied")
        })
    })
})
