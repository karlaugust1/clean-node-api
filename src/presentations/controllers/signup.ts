import { MissingParamError } from "../errors/missing-param-error"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController {

    handle(_httpRequest: HttpRequest): HttpResponse {
        return {
            statusCode: 400,
            body: new MissingParamError("name")
        }
    }

}