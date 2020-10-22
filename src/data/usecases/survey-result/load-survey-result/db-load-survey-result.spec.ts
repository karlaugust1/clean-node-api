import { LoadSurveyResultRepository } from "../../../protocols/db/survey-result/load-survey-result-repository"
import { SurveyResultModel } from "../../../../domain/models/survey-result"
import { mockSurveyResult } from "../../../../domain/test"
import { DbLoadSurveyResult } from "./db-load-survey-result"

type SutTypes = {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {

        async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel> {
            return Promise.resolve(mockSurveyResult())
        }

    }

    return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

    return {
        sut,
        loadSurveyResultRepositoryStub
    }
}

describe("DbLoadSurveyResult Usecase", () => {
    test("Should call LoadSurveyResultRepository", async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
        await sut.load("any_survey_id")
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id")
    })
})