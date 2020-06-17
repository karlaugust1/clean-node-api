import { SignUpController } from "../../presentations/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import env from "../config/env"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { Controller } from "../../presentations/protocols"
import { LogControllerDecorator } from "../decorators/log"

export const makeSignUpController = (): Controller => {
    const emailvalidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController =  new SignUpController(emailvalidatorAdapter, dbAddAccount)

    return new LogControllerDecorator(signUpController)
}