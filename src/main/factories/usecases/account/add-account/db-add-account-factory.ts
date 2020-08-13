import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository"
import { BcryptAdapter } from "../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import env from "../../../../config/env"
import { AddAccount } from "../../../../../domain/usecases/account/add-account"
import { DbAddAccount } from "../../../../../data/usecases/account/add-account/db-add-account"

export const makeDbAddAccount = (): AddAccount => {
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const accountMongoRepository = new AccountMongoRepository()

    return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}