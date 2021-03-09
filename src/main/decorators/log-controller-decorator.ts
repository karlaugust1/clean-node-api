import { Controller, HttpResponse } from "../../presentations/protocols"
import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"

export class LogControllerDecorator implements Controller {

    constructor(
        private readonly controller: Controller,
        private readonly  logErrorRepository: LogErrorRepository
    ) { }

    async handle(request: unknown): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(request)
        if (httpResponse.statusCode === 500) {
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }

        return httpResponse
    }

}