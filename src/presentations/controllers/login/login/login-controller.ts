import { Controller, HttpResponse, Authentication, Validation } from "./login-controller-protocols";
import { badRequest, serverError, unauthorizedError, ok } from "../../../helpers/http/http-helper";

export class LoginController implements Controller {

    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) { }

    async handle(request: LoginController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const { email, password } = request
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const accessToken = await this.authentication.auth({ email, password })
            if (!accessToken) {
                return unauthorizedError()
            }

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }

}

export namespace LoginController {

    export type Request = {
        email: string
        password: string
    }

}