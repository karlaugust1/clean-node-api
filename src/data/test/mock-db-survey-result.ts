import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result"
import { mockSurveyResult } from "../../domain/test/mock-survey-result"
import { LoadSurveyResultRepository } from "../protocols/db/survey-result/load-survey-result-repository"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {

        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResult())
        }

    }

    return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {

        async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResult())
        }

    }

    return new LoadSurveyResultRepositoryStub()
}