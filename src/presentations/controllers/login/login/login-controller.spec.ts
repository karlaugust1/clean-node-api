/* eslint-disable no-unused-vars */
import { LoginController } from "./login-controller"
import { badRequest, serverError, unauthorizedError, ok } from "../../../helpers/http/http-helper"
import { MissingParamError } from "../../../errors"
import { HttpRequest, Authentication, AuthenticationModel, Validation } from "./login-controller-protocols"

type SutTypes = {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {

        // eslint-disable-next-line no-unused-vars
        async auth(_authentication: AuthenticationModel): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_input: any): Error {
            return null
        }

    }

    return new ValidationStub()
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(authenticationStub, validationStub)

    return {
        sut,
        validationStub,
        authenticationStub
    }
}

const makeHttpRequest = (): HttpRequest => ({
    body: {
        email: "any_email@mail.com",
        password: "any_password"
    }
})

describe("Login Controller", () => {
    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, "auth")
        await sut.handle(makeHttpRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" })
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(unauthorizedError())
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should return 200 if valid credentials are provided", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(ok({ accessToken: "any_token" }))
    })

    test("Should call Validation with correct value", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, "validate")
        const httpRequest = makeHttpRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test("Should return 400 if validation returns an error", async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
    })
})