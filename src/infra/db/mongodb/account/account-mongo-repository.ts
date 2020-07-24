import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";
// eslint-disable-next-line max-len
export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {

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

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accounCollection = await MongoHelper.getCollection("accounts")
        await accounCollection.updateOne({ _id: id }, {
            $set: {
                accessToken: token
            }
        })
    }

}