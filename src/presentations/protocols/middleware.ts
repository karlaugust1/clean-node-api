// eslint-disable-next-line semi
import { HttpRequest, HttpResponse } from "./http";

export interface Middleware {
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}