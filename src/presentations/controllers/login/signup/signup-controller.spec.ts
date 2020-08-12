/* eslint-disable no-unused-vars */
import { AccountModel } from "../../../../domain/models/account"
import { MissingParamError, ServerError, EmailInUseError } from "../../../errors"
import { SignUpController } from "./signup-controller"
import { AddAccount, AddAccountModel, Authentication, AuthenticationModel } from "./signup-controller-protocols"
import { ok, badRequest, serverError, forbidden } from "../../../helpers/http/http-helper"
import { HttpRequest, Validation } from "../../../protocols"

type SutTypes = {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
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

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_input: any): Error {
            return null
        }

    }

    return new ValidationStub()
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

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const authenticationStub = makeAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe("SignUp Controller", () => {
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
        expect(httpResponse).toEqual(ok({ accessToken: "any_token" }))
    })

    test("Should return 403 if a AddAccount returns null", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, "add").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
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

    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, "auth")
        await sut.handle(makeHttpRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: "valid_email@mail.com", password: "valid_password" })
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
