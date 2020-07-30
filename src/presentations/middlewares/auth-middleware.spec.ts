/* eslint-disable no-unused-vars */
import { forbidden } from "../helpers/http/http-helper"
import { AccessDeniedError } from "../errors"
import { AuthMiddleware } from "./auth-middleware"
import { HttpRequest } from "../protocols"
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token"
import { AccountModel } from "../../domain/models/account"

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "hashed_password"
})

const makeFakeRequest = (): HttpRequest => ({
    headers: {
        "x-access-token": "any_token"
    }
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {

        async load(_accessToken: string, _role?: string): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }

    }

    return new LoadAccountByTokenStub()
}

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByTokenStub
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub)

    return {
        sut,
        loadAccountByTokenStub
    }
}

describe("Auth Middleware", () => {
    test("Should return 403 if no x-access-token exists in headers", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test("Should call LoadAccountByToken with correct accessToken", async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")

        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith("any_token")
    })
})
