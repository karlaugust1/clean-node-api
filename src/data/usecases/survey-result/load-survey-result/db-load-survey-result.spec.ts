import { LoadSurveyResultRepository } from "../../../protocols/db/survey-result/load-survey-result-repository"
import { SurveyResultModel } from "../../../../domain/models/survey-result"
import { mockSurveyResult } from "../../../../domain/test"
import { DbLoadSurveyResult } from "./db-load-survey-result"

describe("DbLoadSurveyResult Usecase", () => {
    test("Should call LoadSurveyResultRepository", async () => {
        class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {

            async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel> {
                return Promise.resolve(mockSurveyResult())
            }

        }
        const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
        const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
        await sut.load("any_survey_id")
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id")
    })
})