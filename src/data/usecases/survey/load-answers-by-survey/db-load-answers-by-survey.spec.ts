import { LoadSurveyByIdRepository } from "./db-load-answers-by-survey-protocols"
import { DbLoadAnswersBySurvey } from "./db-load-answers-by-survey"
import { throwError, mockSurveyModel } from "../../../../domain/test"
import { mockLoadSurveyByIdRepository } from "../../../test"

type SutTypes = {
    sut: DbLoadAnswersBySurvey
    loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositorySpy = mockLoadSurveyByIdRepository()
    const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

    return {
        sut,
        loadSurveyByIdRepositorySpy
    }
}

describe("DbLoadAnswersBySurvey", () => {
    test("Should call LoadSurveyByIdRepository", async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, "loadById")
        await sut.loadAnswers("any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return answers on success", async () => {
        const { sut } = makeSut()
        const survey = await sut.loadAnswers("any_id")
        const expected = mockSurveyModel()
        expect(survey).toEqual(expected.answers.map(a => a.answer))
    })
    test("Should empty array if LoadSurveyByIdRepository returns null", async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut()
        jest.spyOn(loadSurveyByIdRepositorySpy, "loadById").mockReturnValueOnce(Promise.resolve(null))
        const survey = await sut.loadAnswers("any_id")
        expect(survey).toEqual([])
    })

    test("Should throw if LoadSurveyByIdRepository throws", async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyByIdRepositorySpy, "loadById").mockImplementationOnce(() => throwError())
        const promise = sut.loadAnswers("any_id")
        await expect(promise).rejects.toThrow()
    })
})