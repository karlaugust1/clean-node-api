import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { mockSurveyResultModel } from "../../domain/test/mock-survey-result"
import { LoadSurveyResultRepository } from "../protocols/db/survey-result/load-survey-result-repository"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {

        async save(_data: SaveSurveyResultRepository.Params): Promise<void> {
            return Promise.resolve()
        }

    }

    return new SaveSurveyResultRepositorySpy()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {

        async loadBySurveyId(_surveyId: string, _accountId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel())
        }

    }

    return new LoadSurveyResultRepositorySpy()
}