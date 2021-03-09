import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from "./db-load-survey-result-protocols"
import { DbLoadSurveyResult } from "./db-load-survey-result"
import { mockLoadSurveyResultRepository } from "../../../test/mock-db-survey-result"
import { mockSurveyResultModel, mocEmptySurveyResultModel, throwError } from "../../../../domain/test"
import MockDate from "mockdate"
import { mockLoadSurveyByIdRepository } from "../../../test"

type SutTypes = {
    sut: DbLoadSurveyResult
    loadSurveyResultRepositorySpy: LoadSurveyResultRepository
    loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
    const loadSurveyByIdRepositorySpy = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)

    return {
        sut,
        loadSurveyResultRepositorySpy,
        loadSurveyByIdRepositorySpy
    }
}

describe("DbLoadSurveyResult Usecase", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadSurveyResultRepository with correct values", async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId")
        await sut.load("any_survey_id", "any_id")
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id", "any_id")
    })

    test("Should throw if LoadSurveyResultRepository throws", async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId").mockImplementationOnce(() => throwError())
        const promise = sut.load("any_survey_id", "any_id")
        await expect(promise).rejects.toThrow()
    })

    test("Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null", async () => {
        const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, "loadById")
        jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId").mockReturnValueOnce(Promise.resolve(null))
        await sut.load("any_survey_id", "any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id")
    })

    // eslint-disable-next-line max-len
    test("Should return LoadSurveyByIdRepository with all answers with count 0 if LoadSurveyResultRepository returns null", async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut()
        jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId").mockReturnValueOnce(Promise.resolve(null))
        const result = await sut.load("any_survey_id", "any_id")
        expect(result).toEqual(mocEmptySurveyResultModel())
    })

    test("Should return SurveyResultModel on success", async () => {
        const { sut } = makeSut()
        const result = await sut.load("any_survey_id", "any_id")
        expect(result).toEqual(mockSurveyResultModel())
    })
})