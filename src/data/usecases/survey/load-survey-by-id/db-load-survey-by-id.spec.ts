import { LoadSurveyByIdRepository } from "./db-load-survey-by-id-protocols"
import { DbLoadSurveyById } from "./db-load-survey-by-id"
import MockDate from "mockdate"
import { throwError, mockSurveyModel } from "../../../../domain/test/"
import { mockLoadSurveyByIdRepository } from "../../../../data/test/"

type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositorySpy = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

    return {
        sut,
        loadSurveyByIdRepositorySpy
    }
}

describe("DbLoadSurveyById", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test("Should call LoadSurveyByIdRepository", async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, "loadById")
        await sut.loadById("any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return Survey on success", async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById("any_id")
        expect(survey).toEqual(mockSurveyModel())
    })

    test("Should throw if LoadSurveyByIdRepository throws", async () => {
        const { sut, loadSurveyByIdRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyByIdRepositorySpy, "loadById").mockImplementationOnce(() => throwError())
        const promise = sut.loadById("any_id")
        await expect(promise).rejects.toThrow()
    })
})