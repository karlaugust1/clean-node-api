import { AddAccount, AddAccountModel } from "../../../domain/usecases/add-account"
import { AccountModel } from "../../../domain/models/account"
import { Encrypter } from "../../protocols/encrypter"
import { AddAccountRepository } from "../../protocols/add-account-repository"

export class DbAddAccount implements AddAccount {

    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor(encrypter: Encrypter, repository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = repository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(accountData.password)
        await this.addAccountRepository.add(Object.assign(accountData, { password: hashedPassword }))

        // TODO: use repository
        return new Promise(resolve => resolve(null))
    }

}