import { AddAccount } from "../../../usecases/account/add-account/db-add-account-protocols";

export interface AddAccountRepository {
    add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
    export type Params = AddAccount.Params
    export type Result = boolean
}