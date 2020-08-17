import { DbSaveSurveyResult } from "./db-save-survey-result"
import { SaveSurveyResultRepository } from "../../../protocols/db/survey-result/save-survey-result-repository"
import MockDate from "mockdate"
import { throwError, mockSurveyResultData, mockSurveyResult } from "../../../../domain/test/"
import { mockSaveSurveyResultRepository } from "../../../../data/test/"

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

    return {
        sut,
        saveSurveyResultRepositoryStub
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

    test("Should throw if SaveSurveyResultRepository throws", async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockImplementationOnce(() => throwError())
        const promise = sut.save(mockSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResult on success", async () => {
        const { sut } = makeSut()
        const surveyResultData = await sut.save(mockSurveyResultData())
        expect(surveyResultData).toEqual(mockSurveyResult())
    })
})
