import { SignUpController } from "../../../../../presentations/controllers/login/signup/signup-controller"
import { Controller } from "../../../../../presentations/protocols"
import { makeSignUpValidation } from "./signup-validation-factory"
import { makeDbAuthentication } from "../../../usecases/account/authentication/db-authentication-factory"
import { makeDbAddAccount } from "../../../usecases/account/add-account/db-add-account-factory"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"

// eslint-disable-next-line max-len
export const makeSignUpController = (): Controller => {
    const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())

    return makeLogControllerDecorator(controller)
}