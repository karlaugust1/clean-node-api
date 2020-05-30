// eslint-disable-next-line semi
import { HttpRequest, HttpResponse } from "./http";

export interface Controller {
    handle(httpRequest: HttpRequest): HttpResponse
}