import { LoadSurveyById } from "../../domain/usecases/survey/load-surveys-by-id"
import { SurveyModel } from "../../domain/models/survey"
import { mockSurveyModel, mockSurveysModel } from "../../domain/test"
import { AddSurvey } from "../../domain/usecases/survey/add-survey"
import { LoadSurveys } from "../../domain/usecases/survey/load-surveys"

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveySpy implements AddSurvey {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async add(_data: AddSurvey.Params): Promise<void> {
            return Promise.resolve()
        }

    }

    return new AddSurveySpy()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdSpy implements LoadSurveyById {

        async loadById(_id: string): Promise<SurveyModel> {
            return Promise.resolve(mockSurveyModel())
        }

    }

    return new LoadSurveyByIdSpy()
}

export const mockLoadSurveysSpy = (): LoadSurveys => {
    class LoadSurveysSpy implements LoadSurveys {

        async load(_accountId: string): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveysModel())
        }

    }

    return new LoadSurveysSpy()
}