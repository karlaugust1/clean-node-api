import { LoadSurveyResultRepository } from "./db-load-survey-result-protocols"
import { DbLoadSurveyResult } from "./db-load-survey-result"
import { mockLoadSurveyResultRepository } from "../../../test/mock-db-survey-result"
import { mockSurveyResult, throwError } from "../../../../domain/test"
import MockDate from "mockdate"

type SutTypes = {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository
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
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadSurveyResultRepository", async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
        await sut.load("any_survey_id")
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id")
    })

    test("Should throw if LoadSurveyResultRepository throws", async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockImplementationOnce(() => throwError())
        const promise = sut.load("any_survey_id")
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResultModel on success", async () => {
        const { sut } = makeSut()
        const result = await sut.load("any_survey_id")
        expect(result).toEqual(mockSurveyResult())
    })
})