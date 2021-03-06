import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyRepository } from "./db-add-survey-protocols"
import MockDate from "mockdate"
import { throwError, mockSurveyData } from "../../../../domain/test/"
import { mockAddSurveyRepository } from "../../../../data/test/"

type SutTypes = {
    sut: DbAddSurvey
    addSurveyRepositorySpy: AddSurveyRepository
}

const makeSut = (): SutTypes => {
    const addSurveyRepositorySpy = mockAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositorySpy)

    return {
        sut,
        addSurveyRepositorySpy
    }
}

describe("DbAddSurvey Usecase", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call AddSurveyRepository with correct values", async () => {
        const { sut, addSurveyRepositorySpy } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositorySpy, "add")
        const surveyData = mockSurveyData()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test("Should throw if AddSurveyRepository throws", async () => {
        const { sut, addSurveyRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(addSurveyRepositorySpy, "add").mockImplementationOnce(() => throwError())
        const promise = sut.add(mockSurveyData())
        await expect(promise).rejects.toThrow()
    })
})
