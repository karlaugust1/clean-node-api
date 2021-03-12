/* eslint-disable max-len */
import { Controller } from "../../../../../presentations/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"
import { makeDbLoadAnswersBySurvey } from "../../../usecases/survey/load-survey-by-id/db-load-answers-by-survey-factory"
import { makeDbLoadSurveyResult } from "../../../usecases/survey-result/load-survey-result/db-load-survey-result-factory"
import { LoadSurveyResultController } from "../../../../../presentations/controllers/survey-result/load-survey-result/load-survey-result-controller"

export const makeLoadSurveyResultController = (): Controller => {
    const controller = new LoadSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbLoadSurveyResult())

    return makeLogControllerDecorator(controller)
}