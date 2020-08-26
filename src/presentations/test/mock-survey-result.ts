import { SaveSurveyResult, SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { mockSurveyResult } from "../../domain/test"

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {

        // eslint-disable-next-line no-unused-vars
        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResult())
        }

    }

    return new SaveSurveyResultStub()
}