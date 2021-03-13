/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection } from "mongodb"
import { MongoHelper } from "../../../infra/db/mongodb/helpers"
import { hash } from "bcrypt"
import env from "../../config/env"
import { createTestClient } from "apollo-server-integration-testing"
import { ApolloServer, gql } from "apollo-server-express"
import { makeApolloServer } from "./helpers"

let accountCollection: Collection
let apolloServer: ApolloServer

describe("Login GraphQL", () => {
    beforeAll(async () => {
        apolloServer = makeApolloServer()
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })
    describe("Login Query", () => {
        const loginQuery = gql`
            query login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    accessToken
                    name
                }
            }
        `
        test("Should return an Account on valid credentials", async () => {
            const password = await hash("any_password", Number(env.salt))
            await accountCollection.insertOne({
                name: "any_name",
                email: "any_email@mail.com",
                password
            })
            const { query } = createTestClient({ apolloServer })
            const res: any = await query(loginQuery, {
                variables: {
                    email: "any_email@mail.com",
                    password: "any_password"
                }
            })
            expect(res.data.login.accessToken).toBeTruthy()
            expect(res.data.login.name).toBe("any_name")
        })

        test("Should return Unauthorized erro on invalid credentials", async () => {
            const { query } = createTestClient({ apolloServer })
            const res: any = await query(loginQuery, {
                variables: {
                    email: "any_email@mail.com",
                    password: "any_password"
                }
            })
            expect(res.data).toBeFalsy()
            expect(res.errors[0].message).toBe("Unauthorized")
        })
    })
})
