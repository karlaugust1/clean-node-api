import { AccountModel } from "../../../domain/models/account"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { SignUpController } from "./signup"
import { AddAccount, AddAccountModel, EmailValidator } from "./signup-protocols"
import { ok, badRequest, serverError } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"

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

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password"
})

const makeHttpRequest = (): HttpRequest => ({
    body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
    }
})

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {

        // eslint-disable-next-line no-unused-vars
        async add(_account: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
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
    test("Should return 400 if no name is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: "any_email@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("name")))
    })

    test("Should return 400 if no email is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
    })

    test("Should return 400 if no password is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
    })

    test("Should return 400 if no password confirmation is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_password"
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError("passwordConfirmation")))
    })

    test("Should return 400 if no password confirmation fails", async () => {
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
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError("passwordConfirmation")))
    })

    test("Should return 400 if an invalid email is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
    })

    test("Should call EmailValidator with correct email", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
        const httpRequest = makeHttpRequest()
        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test("Should return 500 if EmailValidator throws", async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test("Should call AddAccount with correct values", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, addAccountStub: addAccount } = makeSut()
        const addSpy = jest.spyOn(addAccount, "add")
        const httpRequest = makeHttpRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password"
        })
    })

    test("Should return 500 if AddAccount throws", async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test("Should return 200 if a valid data is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
})
