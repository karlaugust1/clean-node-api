import { AddSurveyRepository } from "../protocols/db/survey/add-survey-repository"
import { LoadSurveyByIdRepository } from "../protocols/db/survey/load-survey-by-id-repository"
import { SurveyModel } from "../../domain/models/survey"
import { mockSurveyModel, mockSurveysModel } from "../../domain/test/mock-survey"
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository"

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositorySpy implements AddSurveyRepository {

        async add(_surveyData: AddSurveyRepository.Params): Promise<void> {
            return Promise.resolve()
        }

    }

    return new AddSurveyRepositorySpy()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {

        // eslint-disable-next-line no-unused-vars
        async loadById(_id: string): Promise<LoadSurveyByIdRepository.Result> {
            return Promise.resolve(mockSurveyModel())
        }

    }

    return new LoadSurveyByIdRepositorySpy()
}

export const mockLoadSurveysRepositorySpy = (): LoadSurveysRepository => {
    class LoadSurveysRepositorySpy implements LoadSurveysRepository {

        async loadAll(_accountId: string): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveysModel())
        }

    }

    return new LoadSurveysRepositorySpy()
}