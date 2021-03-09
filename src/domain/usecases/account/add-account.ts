import { AccountModel } from "../../models/account";

export type AddAccount = {
    add(account: AddAccount.Params): Promise<AddAccount.Result>
}

export namespace AddAccount {
    export type Params = Omit<AccountModel, "id">
    export type Result = boolean
}