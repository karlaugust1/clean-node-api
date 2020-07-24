import { LogControllerDecorator } from "../../decorators/log-controller-decorator"
import { makeLoginUpValidation } from "../login/login-validation-factory"
import { Controller } from "../../../presentations/protocols"
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication"
import { LoginController } from "../../../presentations/controllers/login/login-controller"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter"
import env from "../../config/env"

export const makeLoginController = (): Controller => {
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    // eslint-disable-next-line max-len
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
    const loginController = new LoginController(dbAuthentication, makeLoginUpValidation())
    const logMongoRepository = new LogMongoRepository()

    return new LogControllerDecorator(loginController, logMongoRepository)
}