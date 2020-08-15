/* eslint-disable max-len */
import { Controller } from "../../../../../presentations/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"
import { SaveSurveyResultController } from "../../../../../presentations/controllers/survey-result/save-survey-result/save-survey-result-controller"
import { makeDbLoadSurveyById } from "../../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory"
import { makeDbSaveSurveyResult } from "../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory"

export const makeSaveSurveyResultController = (): Controller => {
    const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())

    return makeLogControllerDecorator(controller)
}