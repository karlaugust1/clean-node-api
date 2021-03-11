/* eslint-disable no-unused-vars */
import { LoginController } from "./login-controller"
import { badRequest, serverError, unauthorizedError, ok } from "../../../helpers/http/http-helper"
import { MissingParamError } from "../../../errors"
import { Authentication, Validation } from "./login-controller-protocols"
import { throwError } from "../../../../domain/test/"
import { mockAuthentication, mockValidation } from "../../../test"

const mockRequest = (): LoginController.Request => ({
    email: "any_email@mail.com",
    password: "any_password"
})

type SutTypes = {
    sut: LoginController
    authenticationSpy: Authentication
    validationSpy: Validation
}

const makeSut = (): SutTypes => {
    const validationSpy = mockValidation()
    const authenticationSpy = mockAuthentication()
    const sut = new LoginController(authenticationSpy, validationSpy)

    return {
        sut,
        validationSpy,
        authenticationSpy
    }
}

describe("Login Controller", () => {
    test("Should call Authentication with correct values", async () => {
        const { sut, authenticationSpy } = makeSut()
        const authSpy = jest.spyOn(authenticationSpy, "auth")
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" })
    })

    test("Should return 401 if invalid credentials are provided", async () => {
        const { sut, authenticationSpy } = makeSut()
        jest.spyOn(authenticationSpy, "auth").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorizedError())
    })

    test("Should return 500 if Authentication throws", async () => {
        const { sut, authenticationSpy } = makeSut()
        jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should return 200 if valid credentials are provided", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: "any_token", name: "any_name" }))
    })

    test("Should call Validation with correct value", async () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, validationSpy } = makeSut()
        const validateSpy = jest.spyOn(validationSpy, "validate")
        const request = mockRequest()
        await sut.handle(request)
        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test("Should return 400 if validation returns an error", async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
    })
})