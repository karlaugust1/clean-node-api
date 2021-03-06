import { DbAuthentication } from "../../../../../data/usecases/account/authentication/db-authentication"
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository"
import { BcryptAdapter } from "../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../../../infra/criptography/jwt-adapter/jwt-adapter"
import env from "../../../../config/env"
import { Authentication } from "../../../../../domain/usecases/account/authentication"

export const makeDbAuthentication = (): Authentication => {
    const bcryptAdapter = new BcryptAdapter(Number(env.salt))
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()

    // eslint-disable-next-line max-len
    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}