import { SignUpController } from "../../../presentations/controllers/signup/signup"
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter"
import env from "../../config/env"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account"
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/log"
import { Controller } from "../../../presentations/protocols"
import { LogControllerDecorator } from "../../decorators/log"
import { makeSignUpValidation } from "./signup-validation"

export const makeSignUpController = (): Controller => {
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const accountMongoRepository = new AccountMongoRepository()
    const logMongoRepository = new LogMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController =  new SignUpController(dbAddAccount, makeSignUpValidation())

    return new LogControllerDecorator(signUpController, logMongoRepository)
}