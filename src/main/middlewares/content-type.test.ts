import request from "supertest"
import app from "../config/app"

describe("Content-Type Middleware", () => {
    test("Shoud return content-type default as json", async () => {
        app.get("/test-content-type", (_req, res) => res.send())
        await request(app)
            .get("/test-content-type")
            .expect("content-type", /json/)
    })

    test("Shoud return xml content-type when forced", async () => {
        app.get("/test-content-type-xml", (_req, res) =>{
            res.type("xml")
            res.send()
        })
        await request(app)
            .get("/test-content-type-xml")
            .expect("content-type", /xml/)
    })
})

