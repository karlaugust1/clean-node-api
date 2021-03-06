import { SaveSurveyResult, SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result"
import { LoadSurveyResult } from "../../domain/usecases/survey-result/load-survey-result"
import { SurveyResultModel } from "../../domain/models/survey-result"
import { mockSurveyResultModel } from "../../domain/test"

export const mockSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {

        // eslint-disable-next-line no-unused-vars
        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel())
        }

    }

    return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
    class LoadSurveyResultStub implements LoadSurveyResult {

        // eslint-disable-next-line no-unused-vars
        async load(_surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResultModel())
        }

    }

    return new LoadSurveyResultStub()
}