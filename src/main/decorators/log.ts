import { Controller, HttpRequest, HttpResponse } from "../../presentations/protocols"

export class LogControllerDecorator implements Controller {

    private readonly controller: Controller

    constructor(controller: Controller) {
        this.controller = controller
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)

        return httpResponse
    }

}