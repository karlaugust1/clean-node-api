import { DbSaveSurveyResult } from "./db-save-survey-result"
import MockDate from "mockdate"
import { throwError, mockSurveyResultData, mockSurveyResultModel } from "../../../../domain/test/"
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from "../../../../data/test/"
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from "./db-save-survey-result-protocols"

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositorySpy: SaveSurveyResultRepository
    loadSurveyResultRepositorySpy: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositorySpy = mockSaveSurveyResultRepository()
    const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)

    return {
        sut,
        saveSurveyResultRepositorySpy,
        loadSurveyResultRepositorySpy
    }
}

describe("DbSaveSurveyResult Usecase", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call SaveSurveyResultRepository with correct values", async () => {
        const { sut, saveSurveyResultRepositorySpy } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, "save")
        const surveyResultData = mockSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test("Should call LoadSurveyResultRepository with correct values", async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId")
        const surveyResultData = mockSurveyResultData()
        await sut.save(surveyResultData)
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
    })

    test("Should throw if SaveSurveyResultRepository throws", async () => {
        const { sut, saveSurveyResultRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(saveSurveyResultRepositorySpy, "save").mockImplementationOnce(() => throwError())
        const promise = sut.save(mockSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if LoadSurveyResultRepository throws", async () => {
        const { sut, loadSurveyResultRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyResultRepositorySpy, "loadBySurveyId").mockImplementationOnce(() => throwError())
        const promise = sut.save(mockSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResult on success", async () => {
        const { sut } = makeSut()
        const surveyResultData = await sut.save(mockSurveyResultData())
        expect(surveyResultData).toEqual(mockSurveyResultModel())
    })
})
