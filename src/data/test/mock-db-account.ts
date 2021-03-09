import { AddAccountRepository } from "../protocols/db/account/add-account-repository"
import { LoadAccountByEmailRepository } from "../protocols/db/account/load-account-by-email-repository"
import { LoadAccountByTokenRepository } from "../protocols/db/account/load-account-by-token-repository"
import { UpdateAccessTokenRepository } from "../protocols/db/account/update-access-token-repository"
import { AccountModel } from "../../domain/models/account"
import { mockAccountModel } from "../../domain/test"

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositorySpy implements AddAccountRepository {

        // eslint-disable-next-line no-unused-vars
        async add(_accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
            return Promise.resolve(mockAccountModel())
        }

    }

    return new AddAccountRepositorySpy()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {

        // eslint-disable-next-line no-unused-vars
        async loadByEmail(_email: string): Promise<AccountModel> {
            const account: AccountModel = mockAccountModel()

            return Promise.resolve(account)
        }

    }

    return new LoadAccountByEmailRepositorySpy()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {

        async loadByToken(_token: string, _role?: string): Promise<AccountModel> {
            return Promise.resolve(mockAccountModel())
        }

    }

    return new LoadAccountByTokenRepositorySpy()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {

        // eslint-disable-next-line no-unused-vars
        async updateAccessToken(_id: string, _token: string): Promise<void> {
            return Promise.resolve()
        }

    }

    return new UpdateAccessTokenRepositorySpy()
}