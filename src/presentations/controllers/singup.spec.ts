import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { EmailValidator } from "../protocols/email-validator"
import { SignUpController } from "./signup"

interface SutTypes {
    sut: SignUpController
    emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {

        isValid(_email: string): boolean {
            return true
        }

    }
    const emailValidatorstub = new EmailValidatorStub()

    const sut = new SignUpController(emailValidatorstub)

    return {
        sut,
        emailValidator: emailValidatorstub
    }
}

describe("SignUp Controller", () => {
    test("Should return 400 if no name is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("name"))
    })

    test("Should return 400 if no email is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("email"))
    })

    test("Should return 400 if no password is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("password"))
    })

    test("Should return 400 if no password confirmation is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"))
    })

    test("Should return 400 if an invalid email is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidator } = makeSut()
        jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError("email"))
    })
})
