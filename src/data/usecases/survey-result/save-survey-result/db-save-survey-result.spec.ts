import { DbSaveSurveyResult } from "./db-save-survey-result"
import MockDate from "mockdate"
import { throwError, mockSurveyResultData, mockSurveyResult } from "../../../../domain/test/"
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from "../../../../data/test/"
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from "./db-save-survey-result-protocols"

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
    loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

    return {
        sut,
        saveSurveyResultRepositoryStub,
        loadSurveyResultRepositoryStub
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
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save")
        const surveyResultData = mockSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test("Should call LoadSurveyResultRepository with correct values", async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
        const surveyResultData = mockSurveyResultData()
        await sut.save(surveyResultData)
        expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
    })

    test("Should throw if SaveSurveyResultRepository throws", async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockImplementationOnce(() => throwError())
        const promise = sut.save(mockSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if LoadSurveyResultRepository throws", async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId").mockImplementationOnce(() => throwError())
        const promise = sut.save(mockSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResult on success", async () => {
        const { sut } = makeSut()
        const surveyResultData = await sut.save(mockSurveyResultData())
        expect(surveyResultData).toEqual(mockSurveyResult())
    })
})
