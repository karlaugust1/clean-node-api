import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account"
import { AccountModel } from "../../../domain/models/account"
import { Encrypter } from "../../protocols/encrypter"
import { AddAccountRepository } from "../../protocols/add-account-repository"

export class DbAddAccount implements AddAccount {

    private readonly encrypter: Encrypter
    private readonly repository: AddAccountRepository

    constructor(encrypter: Encrypter, repository: AddAccountRepository) {
        this.encrypter = encrypter
        this.repository = repository
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)

        return this.repository.add(account)
    }

}