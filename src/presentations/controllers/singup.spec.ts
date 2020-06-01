import { AccountModel } from "../../domain/models/account"
import { AddAccount, AddAccountModel } from "../../domain/usecases/add-account"
import { InvalidParamError, MissingParamError, ServerError } from "../errors"
import { EmailValidator } from "../protocols"
import { SignUpController } from "./signup"

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {

        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {

        // eslint-disable-next-line no-unused-vars
        add(_account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email",
                password: "valid_password"
            }

            return fakeAccount
        }

    }

    return new AddAccountStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub
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

    test("Should return 400 if no password confirmation fails", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "invalid_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"))
    })

    test("Should return 400 if an invalid email is provided", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub: emailValidator } = makeSut()
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

    test("Should call EmailValidator with correct email", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub: emailValidator } = makeSut()
        const isValidSpy = jest.spyOn(emailValidator, "isValid")
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test("Should return 500 if EmailValidator throws", () => {
        const { sut, emailValidatorStub: emailValidator } = makeSut()
        jest.spyOn(emailValidator, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test("Should call AddAccount with correct values", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, addAccountStub: addAccount } = makeSut()
        const addSpy = jest.spyOn(addAccount, "add")
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password"
        })
    })
})
