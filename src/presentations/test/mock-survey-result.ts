import { SaveSurveyResult, SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result"
import { LoadSurveyResult } from "../../domain/usecases/survey-result/load-survey-result"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { mockSurveyResultModel } from "../../domain/test"

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultSpy implements SaveSurveyResult {

        // eslint-disable-next-line no-unused-vars
        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel())
        }

    }

    return new SaveSurveyResultSpy()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
    class LoadSurveyResultSpy implements LoadSurveyResult {

        // eslint-disable-next-line no-unused-vars
        async load(_surveyId: string, _accountId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel())
        }

    }

    return new LoadSurveyResultSpy()
}