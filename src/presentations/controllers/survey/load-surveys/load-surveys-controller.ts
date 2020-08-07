import { Controller, HttpResponse, HttpRequest, LoadSurveys } from "./load-surveys-controller-protocols";
import { ok, serverError, noContent } from "../../../helpers/http/http-helper";

export class LoadSurveysController implements Controller {

    constructor(
        private readonly loadSurveys: LoadSurveys
    ) { }

    async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurveys.load()

            return surveys.length ? ok(surveys) : noContent()
        } catch (error) {
            return serverError(error)
        }
    }

}