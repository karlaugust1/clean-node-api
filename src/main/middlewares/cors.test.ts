import request from "supertest"
import app from "../config/app"

describe("CORS Middleware", () => {
    test("Shoud enable cors", async () => {
        app.get("/test-cors", (_req, res) => res.send())
        await request(app)
            .get("/test-cors")
            .expect("access-control-allow-origin", "*")
            .expect("access-control-allow-methods", "*")
            .expect("access-control-allow-headers", "*")
    })
})

