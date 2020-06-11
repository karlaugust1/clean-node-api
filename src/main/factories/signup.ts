import { SignUpController } from "../../presentations/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import env from "../config/env"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"

export const makeSignUpController = (): SignUpController => {
    const emailvalidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

    return new SignUpController(emailvalidatorAdapter, dbAddAccount)
}