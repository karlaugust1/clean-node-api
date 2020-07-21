import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {

    private readonly hasher: Hasher
    private readonly addAccountRepository: AddAccountRepository

    constructor(hasher: Hasher, repository: AddAccountRepository) {
        this.hasher = hasher
        this.addAccountRepository = repository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })

        return account
    }

}