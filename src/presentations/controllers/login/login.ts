import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../../errors";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {

    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body.email) {
            return Promise.resolve(badRequest(new MissingParamError("email")))
        }
        if (!httpRequest.body.password) {
            return Promise.resolve(badRequest(new MissingParamError("password")))
        }
        const isValid = this.emailValidator.isValid(httpRequest.body.email)
        if (!isValid) {
            return Promise.resolve(badRequest(new InvalidParamError("email")))
        }
    }

}