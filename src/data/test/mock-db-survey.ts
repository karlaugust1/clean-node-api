import { AddSurveyRepository } from "../protocols/db/survey/add-survey-repository"
import { AddSurveyParams } from "../../domain/usecases/survey/add-survey"
import { LoadSurveyByIdRepository } from "../protocols/db/survey/load-survey-by-id-repository"
import { SurveyModel } from "../../domain/models/survey"
import { mockSurveyModel, mockSurveysModel } from "../../domain/test/mock-survey"
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository"

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {

        async add(_surveyData: AddSurveyParams): Promise<void> {
            return Promise.resolve()
        }

    }

    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {

        // eslint-disable-next-line no-unused-vars
        async loadById(_id: string): Promise<SurveyModel> {
            return Promise.resolve(mockSurveyModel())
        }

    }

    return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {

        async loadAll(): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveysModel())
        }

    }

    return new LoadSurveysRepositoryStub()
}