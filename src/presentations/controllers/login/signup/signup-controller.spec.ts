/* eslint-disable no-unused-vars */
import { MissingParamError, ServerError, EmailInUseError } from "../../../errors"
import { SignUpController } from "./signup-controller"
import { AddAccount, Authentication } from "./signup-controller-protocols"
import { ok, badRequest, serverError, forbidden } from "../../../helpers/http/http-helper"
import { Validation } from "../../../protocols"
import { throwError } from "../../../../domain/test/"
import { mockValidation, mockAuthentication, mockAddAccount } from "../../../test"

type SutTypes = {
    sut: SignUpController
    addAccountSpy: AddAccount
    validationSpy: Validation
    authenticationSpy: Authentication
}

const mockHttpRequest = (): SignUpController.Request => ({

    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
    passwordConfirmation: "valid_password"

})

const makeSut = (): SutTypes => {
    const addAccountSpy = mockAddAccount()
    const validationSpy = mockValidation()
    const authenticationSpy = mockAuthentication()
    const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)

    return {
        sut,
        addAccountSpy,
        validationSpy,
        authenticationSpy
    }
}

describe("SignUp Controller", () => {
    test("Should call AddAccount with correct values", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, addAccountSpy: addAccount } = makeSut()
        const addSpy = jest.spyOn(addAccount, "add")
        const request = mockHttpRequest()
        await sut.handle(request)
        expect(addSpy).toHaveBeenCalledWith({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_password"
        })
    })

    test("Should return 500 if AddAccount throws", async () => {
        const { sut, addAccountSpy } = makeSut()
        jest.spyOn(addAccountSpy, "add").mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(mockHttpRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test("Should return 200 if a valid data is provided", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockHttpRequest())
        expect(httpResponse).toEqual(ok({ accessToken: "any_token", name: "any_name" }))
    })

    test("Should return 403 if a AddAccount returns null", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, addAccountSpy } = makeSut()
        jest.spyOn(addAccountSpy, "add").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockHttpRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test("Should call Validation with correct value", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, validationSpy } = makeSut()
        const validateSpy = jest.spyOn(validationSpy, "validate")
        const request = mockHttpRequest()
        await sut.handle(request)
        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test("Should return 400 if validation returns an error", async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
        const httpResponse = await sut.handle(mockHttpRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
    })

    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationSpy } = makeSut()
        const authSpy = jest.spyOn(authenticationSpy, "auth")
        await sut.handle(mockHttpRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: "valid_email@mail.com", password: "valid_password" })
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authenticationSpy } = makeSut()
        jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
