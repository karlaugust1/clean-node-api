import { DbLoadAnswersBySurvey } from "./db-load-answers-by-survey"
import { throwError, mockSurveyModel } from "../../../../domain/test"
import { mockLoadAnswersBySurveyRepository } from "../../../test"
import { LoadAnswersBySurveyRepository } from "./db-load-answers-by-survey-protocols"

type SutTypes = {
    sut: DbLoadAnswersBySurvey
    loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
    const loadAnswersBySurveyRepositorySpy = mockLoadAnswersBySurveyRepository()
    const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

    return {
        sut,
        loadAnswersBySurveyRepository: loadAnswersBySurveyRepositorySpy
    }
}

describe("DbLoadAnswersBySurvey", () => {
    test("Should call LoadSurveyByIdRepository", async () => {
        const { sut, loadAnswersBySurveyRepository: loadSurveyByIdRepositorySpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, "loadAnswers")
        await sut.loadAnswers("any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return answers on success", async () => {
        const { sut } = makeSut()
        const survey = await sut.loadAnswers("any_id")
        const expected = mockSurveyModel()
        expect(survey).toEqual(expected.answers.map(a => a.answer))
    })
    test("Should empty array if LoadSurveyByIdRepository returns empty array", async () => {
        const { sut, loadAnswersBySurveyRepository: loadSurveyByIdRepositorySpy } = makeSut()
        jest.spyOn(loadSurveyByIdRepositorySpy, "loadAnswers").mockReturnValueOnce(Promise.resolve([]))
        const survey = await sut.loadAnswers("any_id")
        expect(survey).toEqual([])
    })

    test("Should throw if LoadSurveyByIdRepository throws", async () => {
        const { sut, loadAnswersBySurveyRepository: loadSurveyByIdRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyByIdRepositorySpy, "loadAnswers").mockImplementationOnce(() => throwError())
        const promise = sut.loadAnswers("any_id")
        await expect(promise).rejects.toThrow()
    })
})