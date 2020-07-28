import { badRequest, ok, serverError } from "../../helpers/http/http-helper"
import { AddAccount, Controller, HttpRequest, HttpResponse, Authentication } from "./signup-controller-protocols"
import { Validation } from "../../helpers/validators/validation"
export class SignUpController implements Controller {

    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = httpRequest.body
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const account = await this.addAccount.add({
                name,
                email,
                password
            })

            const accessToken = await this.authentication.auth({ email, password })

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }

}