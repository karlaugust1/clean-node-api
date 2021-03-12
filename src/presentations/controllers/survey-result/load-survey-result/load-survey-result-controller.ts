import { LoadSurveyResult } from "../../../../domain/usecases/survey-result/load-survey-result"
import { InvalidParamError } from "../../../errors"
import { forbidden, ok, serverError } from "../../../helpers/http/http-helper"
import {
    Controller, HttpResponse, LoadAnswersBySurvey
} from "../load-survey-result/load-survey-result-controller-protocols"

export class LoadSurveyResultController implements Controller {

    constructor(
        private readonly loadSurveyById: LoadAnswersBySurvey,
        private readonly loadSurveyResult: LoadSurveyResult
    ) { }

    async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
        try {
            const { surveyId } = request
            const survey = await this.loadSurveyById.loadAnswers(surveyId)
            if (!survey.length) {
                return forbidden(new InvalidParamError("surveyId"))
            }

            const surveyResult = await this.loadSurveyResult.load(surveyId, request.accountId)

            return ok(surveyResult)
        } catch (error) {
            return serverError(error)
        }
    }

}

export namespace LoadSurveyResultController {

    export type Request = {
        surveyId: string
        accountId: string
    }

}