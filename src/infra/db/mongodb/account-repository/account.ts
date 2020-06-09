import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AccountModel } from "../../../../domain/models/account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accounCollection = MongoHelper.getCollection("accounts")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const result = await accounCollection.insertOne(accountData)
        const account = result.ops[0]
        const { _id, ...accountWithoutId } = account

        return Object.assign(accountWithoutId, { id: _id }) as AccountModel
    }

}