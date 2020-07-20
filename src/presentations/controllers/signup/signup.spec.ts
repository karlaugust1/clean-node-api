/* eslint-disable no-unused-vars */
import { AccountModel } from "../../../domain/models/account"
import { MissingParamError, ServerError } from "../../errors"
import { SignUpController } from "./signup"
import { AddAccount, AddAccountModel } from "./signup-protocols"
import { ok, badRequest, serverError } from "../../helpers/http-helper"
import { HttpRequest } from "../../protocols"
import { Validation } from "../../helpers/validators/validation"

interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
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

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(addAccountStub, validationStub)

    return {
        sut,
        addAccountStub,
        validationStub
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
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
