import { Controller, HttpRequest, HttpResponse, Authentication } from "./login-controller-protocols";
import { badRequest, serverError, unauthorizedError, ok } from "../../helpers/http/http-helper";
import { Validation } from "../signup/signup-controller-protocols";

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