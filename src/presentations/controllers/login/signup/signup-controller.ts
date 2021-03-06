import { badRequest, ok, serverError, forbidden } from "../../../helpers/http/http-helper"
import { AddAccount, Controller, HttpResponse, Authentication } from "./signup-controller-protocols"
import { Validation } from "../../../protocols/validation"
import { EmailInUseError } from "../../../errors"
export class SignUpController implements Controller {

    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) { }

    async handle(request: SignUpController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = request
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const isValid = await this.addAccount.add({
                name,
                email,
                password
            })

            if (!isValid) {
                return forbidden(new EmailInUseError())
            }

            const accessToken = await this.authentication.auth({ email, password })

            return ok(accessToken)
        } catch (error) {
            return serverError(error)
        }
    }

}

export namespace SignUpController {

    export type Request = {
        name: string
        email: string
        password: string
        passwordConfirmation: string
    }

}