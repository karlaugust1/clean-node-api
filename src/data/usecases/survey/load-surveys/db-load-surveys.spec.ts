import { LoadSurveysRepository } from "./db-load-surveys-protocols"
import { DbLoadSurveys } from "./db-load-surveys"
import MockDate from "mockdate"
import { throwError, mockSurveysModel } from "../../../../domain/test/"
import { mockLoadSurveysRepositorySpy } from "../../../../data/test/"

type SutTypes = {
    sut: DbLoadSurveys
    loadSurveysRepositorySpy: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    const loadSurveysRepositorySpy = mockLoadSurveysRepositorySpy()
    const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

    return {
        sut,
        loadSurveysRepositorySpy
    }
}

describe("DbLoadSurveys", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadSurveysRepository", async () => {
        const { sut, loadSurveysRepositorySpy } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, "loadAll")
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })
    test("Should return a list of Surveys on success", async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(mockSurveysModel())
    })
    test("Should throw if LoadSurveysRepository throws", async () => {
        const { sut, loadSurveysRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveysRepositorySpy, "loadAll").mockImplementationOnce(() => throwError())
        const promise = sut.load()
        await expect(promise).rejects.toThrow()
    })
})
