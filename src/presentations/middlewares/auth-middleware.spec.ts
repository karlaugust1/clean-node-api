/* eslint-disable no-unused-vars */
import { LoadAccountByToken, HttpRequest } from "./auth-middleware-protocols";
import { forbidden, ok, serverError } from "../helpers/http/http-helper"
import { AccessDeniedError } from "../errors"
import { AuthMiddleware } from "./auth-middleware"
import { mockLoadAccountByToken } from "../test";

const mockRequest = (): HttpRequest => ({
    headers: {
        "x-access-token": "any_token"
    }
})

type SutTypes = {
    sut: AuthMiddleware
    loadAccountByTokenSpy: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenSpy = mockLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenSpy, role)

    return {
        sut,
        loadAccountByTokenSpy
    }
}

describe("Auth Middleware", () => {
    test("Should return 403 if no x-access-token exists in headers", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test("Should call LoadAccountByToken with correct accessToken", async () => {
        const role = "any_role"
        const { sut, loadAccountByTokenSpy } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenSpy, "loadByToken")

        await sut.handle(mockRequest())
        expect(loadSpy).toHaveBeenCalledWith("any_token", role)
    })

    test("Should return 403 if LoadAccountByToken returns null", async () => {
        const { sut, loadAccountByTokenSpy } = makeSut()
        jest.spyOn(loadAccountByTokenSpy, "loadByToken").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test("Should return 200 if LoadAccountByToken returns an account", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accountId: "any_id" }))
    })

    test("Should return 500 if LoadAccountByToken throws", async () => {
        const { sut, loadAccountByTokenSpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadAccountByTokenSpy, "loadByToken").mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
