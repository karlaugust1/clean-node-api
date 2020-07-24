import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"
import { hash } from "bcrypt"
import env from "../config/env"

let accountCollection: Collection

describe("Login Routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    describe("POST /signup", () => {
        test("Shoud return 200 on signup", async () => {
            await request(app)
                .post("/api/signup")
                .send({
                    name: "any_name",
                    email: "any_email@mail.com",
                    password: "any_password",
                    passwordConfirmation: "any_password"
                })
                .expect(200)
        })
    })

    describe("POST /login", () => {
        test("Shoud return 200 on login", async () => {
            const password = await hash("any_password", Number(env.salt))
            await accountCollection.insertOne({
                name: "any_name",
                email: "any_email@mail.com",
                password
            })
            await request(app)
                .post("/api/login")
                .send({
                    email: "any_email@mail.com",
                    password: "any_password"
                })
                .expect(200)
        })

        test("Shoud return 401 on login", async () => {
            await request(app)
                .post("/api/login")
                .send({
                    email: "any_email@mail.com",
                    password: "any_password"
                })
                .expect(401)
        })
    })
})
