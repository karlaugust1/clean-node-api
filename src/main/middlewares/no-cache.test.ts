import request from "supertest"
import app from "../config/app"
import { noCache } from "./no-cache"

describe("NoChace Middleware", () => {
    test("Shoud disable cache", async () => {
        app.get("/test-no-cache", noCache, (_req, res) => res.send())
        await request(app)
            .get("/test-no-cache")
            .expect("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidade")
            .expect("pragma", "no-cache")
            .expect("expires", "0")
            .expect("surrogate-control", "no-store")
    })
})

