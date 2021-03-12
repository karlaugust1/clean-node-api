/* eslint-disable max-len */
import { Controller } from "../../../../../presentations/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"
import { SaveSurveyResultController } from "../../../../../presentations/controllers/survey-result/save-survey-result/save-survey-result-controller"
import { makeDbLoadAnswersBySurvey } from "../../../usecases/survey/load-survey-by-id/db-load-answers-by-survey-factory"
import { makeDbSaveSurveyResult } from "../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory"

export const makeSaveSurveyResultController = (): Controller => {
    const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())

    return makeLogControllerDecorator(controller)
}