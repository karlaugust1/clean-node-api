import { AddAccountRepository } from "../protocols/db/account/add-account-repository"
import { LoadAccountByEmailRepository } from "../protocols/db/account/load-account-by-email-repository"
import { LoadAccountByTokenRepository } from "../protocols/db/account/load-account-by-token-repository"
import { UpdateAccessTokenRepository } from "../protocols/db/account/update-access-token-repository"
import { mockAccountModel } from "../../domain/test"
import { CheckAccountByEmailRepository } from "../protocols/db/account/check-account-by-email-repository"

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositorySpy implements AddAccountRepository {

        // eslint-disable-next-line no-unused-vars
        async add(_accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
            return Promise.resolve(true)
        }

    }

    return new AddAccountRepositorySpy()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {

        // eslint-disable-next-line no-unused-vars
        async loadByEmail(_email: string): Promise<LoadAccountByEmailRepository.Result> {
            const account = mockAccountModel()
            delete account.email

            return Promise.resolve(account)
        }

    }

    return new LoadAccountByEmailRepositorySpy()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
    class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {

        // eslint-disable-next-line no-unused-vars
        async checkByEmail(_email: string): Promise<CheckAccountByEmailRepository.Result> {
            return Promise.resolve(false)
        }

    }

    return new CheckAccountByEmailRepositorySpy()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {

        async loadByToken(_token: string, _role?: string): Promise<LoadAccountByTokenRepository.Result> {
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