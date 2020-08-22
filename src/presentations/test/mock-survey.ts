import { LoadSurveyById } from "../../domain/usecases/survey/load-surveys-by-id"
import { SurveyModel } from "../../domain/models/survey"
import { mockSurveyModel, mockSurveysModel } from "../../domain/test"
import { AddSurvey, AddSurveyParams } from "../../domain/usecases/survey/add-survey"
import { LoadSurveys } from "../../domain/usecases/survey/load-surveys"

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async add(_data: AddSurveyParams): Promise<void> {
            return new Promise(resolve => resolve())
        }

    }

    return new AddSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {

        async loadById(_id: string): Promise<SurveyModel> {
            return Promise.resolve(mockSurveyModel())
        }

    }

    return new LoadSurveyByIdStub()
}

export const mockLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {

        async load(): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveysModel())
        }

    }

    return new LoadSurveysStub()
}