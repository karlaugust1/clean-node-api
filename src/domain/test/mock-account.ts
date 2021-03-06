/* eslint-disable max-len */
import { AccountModel } from "../models/account"
import { AddAccount } from "../usecases/account/add-account"
import { Authentication } from "../usecases/account/authentication"

export const mockAddAccountParams = (): AddAccount.Params => ({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password"
})

export const mockAccountModel = (): AccountModel => ({ ...mockAddAccountParams(), id: "any_id" })

export const mockAuthentication = (): Authentication.Params => ({ email: "any_email@mail.com", password: "any_password" })