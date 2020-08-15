import { Controller } from "../../../../../presentations/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator.factory"
import { makeDbLoadSurveys } from "../../../usecases/survey/load-surveys/db-load-surveys-factory"
// eslint-disable-next-line max-len
import { LoadSurveysController } from "../../../../../presentations/controllers/survey/load-surveys/load-surveys-controller"

export const makeLoadSurveysController = (): Controller => {
    const controller = new LoadSurveysController(makeDbLoadSurveys())

    return makeLogControllerDecorator(controller)
}