import { MissingParamError } from "../errors/missing-param-error"
import { SignUpController } from "./signup"

describe("SignUp Controller", () => {
    test("Should return 400 if no name is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const sut = new SignUpController()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                password: "any_password",
                passwoordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("name"))
    })
})
