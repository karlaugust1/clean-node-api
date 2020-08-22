import { AddAccount, AddAccountParams } from "../../domain/usecases/account/add-account"
import { mockAccountModel } from "../../domain/test"
import { AccountModel } from "../../domain/models/account"
import { Authentication, AuthenticationParams } from "../../domain/usecases/account/authentication"
import { LoadAccountByToken } from "../middlewares/auth-middleware-protocols"

export const mockAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {

        // eslint-disable-next-line no-unused-vars
        async add(_account: AddAccountParams): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }

    }

    return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {

        // eslint-disable-next-line no-unused-vars
        async auth(_authentication: AuthenticationParams): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {

        async loadByToken(_accessToken: string, _role?: string): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }

    }

    return new LoadAccountByTokenStub()
}