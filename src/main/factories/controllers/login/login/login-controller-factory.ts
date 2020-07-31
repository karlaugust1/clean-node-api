import { makeLoginUpValidation } from "./login-validation-factory"
import { Controller } from "../../../../../presentations/protocols"
import { LoginController } from "../../../../../presentations/controllers/login/login/login-controller"
import { makeDbAuthentication } from "../../../usecases/account/authentication/db-authentication-factory"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"

export const makeLoginController = (): Controller => {
    const controller = new LoginController(makeDbAuthentication(), makeLoginUpValidation())

    return makeLogControllerDecorator(controller)
}