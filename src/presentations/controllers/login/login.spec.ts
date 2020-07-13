import { LoginController } from "./login"
import { badRequest, serverError, unauthorizedError } from "../../helpers/http-helper"
import { MissingParamError, InvalidParamError } from "../../errors"
import { EmailValidator, HttpRequest } from "../signup/signup-protocols"
import { Authentication } from "../../../domain/usecases/authentication"

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {

        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {

        async auth(_email: string, _password: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return {
        sut,
        emailValidatorStub,
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
    test("Should return 400 if no email is provided", async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should return 400 if an invalid email is provided", async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
    })

    test("Should call EmailValidator with correct email", async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
        await sut.handle(makeHttpRequest())
        expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => { throw new Error("") })
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, "auth")
        await sut.handle(makeHttpRequest())
        expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password")
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(unauthorizedError())
    })
})