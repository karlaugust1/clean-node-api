import { DbSaveSurveyResult } from "./db-save-survey-result"
import { SaveSurveyResultParams } from "../../../../domain/usecases/survey-result/save-survey-result"
import { SurveyResultModel } from "../../../../domain/models/survey-result"
import { SaveSurveyResultRepository } from "../../../protocols/db/survey-result/save-survey-result-repository"
import MockDate from "mockdate"

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
    accountId: "any_account_id",
    surveyId: "any_survey_id",
    answer: "any_answer",
    date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({ ...makeFakeSurveyResultData(), id: "any_id" })

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {

        async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult())
        }

    }

    return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test("Should throw if SaveSurveyResultRepository throws", async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResult on success", async () => {
        const { sut } = makeSut()
        const surveyResultData = await sut.save(makeFakeSurveyResultData())
        expect(surveyResultData).toEqual(makeFakeSurveyResult())
    })
})
