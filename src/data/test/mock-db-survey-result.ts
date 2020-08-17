import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result"
import { mockSurveyResult } from "../../domain/test/mock-survey-result"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {

        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResult())
        }

    }

    return new SaveSurveyResultRepositoryStub()
}