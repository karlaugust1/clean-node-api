import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from "./login-controller-protocols";
import { badRequest, serverError, unauthorizedError, ok } from "../../../helpers/http/http-helper";

export class LoginController implements Controller {

    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { email, password } = httpRequest.body
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const authenticationModel = await this.authentication.auth({ email, password })
            if (!authenticationModel) {
                return unauthorizedError()
            }

            return ok(authenticationModel)
        } catch (error) {
            return serverError(error)
        }
    }

}