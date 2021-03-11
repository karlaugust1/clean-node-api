import { AddAccount } from "../../domain/usecases/account/add-account"
import { mockAccountModel } from "../../domain/test"
import { AccountModel } from "../../domain/models/account"
import { Authentication } from "../../domain/usecases/account/authentication"
import { LoadAccountByToken } from "../middlewares/auth-middleware-protocols"

export const mockAddAccount = (): AddAccount => {
    class AddAccountSpy implements AddAccount {

        // eslint-disable-next-line no-unused-vars
        async add(_account: AddAccount.Params): Promise<boolean> {
            return Promise.resolve(true)
        }

    }

    return new AddAccountSpy()
}

export const mockAuthentication = (): Authentication => {
    class AuthenticationSpy implements Authentication {

        // eslint-disable-next-line no-unused-vars
        async auth(_authentication: Authentication.Params): Promise<Authentication.Result> {
            return Promise.resolve({ accessToken: "any_token", name: "any_name" })
        }

    }

    return new AuthenticationSpy()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenSpy implements LoadAccountByToken {

        async loadByToken(_accessToken: string, _role?: string): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }

    }

    return new LoadAccountByTokenSpy()
}