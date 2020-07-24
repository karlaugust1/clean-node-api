import { SignUpController } from "../../../presentations/controllers/signup/signup-controller"
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import env from "../../config/env"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { Controller } from "../../../presentations/protocols"
import { LogControllerDecorator } from "../../decorators/log-controller-decorator"
import { makeSignUpValidation } from "./signup-validation-factory"

export const makeSignUpController = (): Controller => {
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const accountMongoRepository = new AccountMongoRepository()
    const logMongoRepository = new LogMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController =  new SignUpController(dbAddAccount, makeSignUpValidation())

    return new LogControllerDecorator(signUpController, logMongoRepository)
}