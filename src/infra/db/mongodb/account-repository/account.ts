import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accounCollection = await MongoHelper.getCollection("accounts")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const result = await accounCollection.insertOne(accountData)

        return MongoHelper.map(result.ops[0]) as AccountModel
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accounCollection = await MongoHelper.getCollection("accounts")
        const account = await accounCollection.findOne({ email })

        return account && MongoHelper.map(account) as AccountModel
    }

}