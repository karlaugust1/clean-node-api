import { CheckSurveyByIdRepository } from "./db-check-survey-by-id-protocols"
import { DbCheckSurveyById } from "./db-check-survey-by-id"
import MockDate from "mockdate"
import { throwError } from "../../../../domain/test/"
import { mockCheckSurveyByIdRepository } from "../../../../data/test/"

type SutTypes = {
    sut: DbCheckSurveyById
    checkSurveyByIdRepositorySpy: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const checkSurveyByIdRepositorySpy = mockCheckSurveyByIdRepository()
    const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

    return {
        sut,
        checkSurveyByIdRepositorySpy
    }
}

describe("DbCheckSurveyById", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test("Should call CheckSurveyByIdRepository", async () => {
        const { sut, checkSurveyByIdRepositorySpy } = makeSut()
        const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositorySpy, "checkById")
        await sut.checkById("any_id")
        expect(checkByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return true if CheckSurveyById returns true", async () => {
        const { sut } = makeSut()
        const exists = await sut.checkById("any_id")
        expect(exists).toBe(true)
    })
    test("Should return false if CheckSurveyById returns false", async () => {
        const { sut, checkSurveyByIdRepositorySpy } = makeSut()
        jest.spyOn(checkSurveyByIdRepositorySpy, "checkById").mockReturnValueOnce(Promise.resolve(false))
        const exists = await sut.checkById("any_id")
        expect(exists).toBe(false)
    })

    test("Should throw if CheckSurveyByIdRepository throws", async () => {
        const { sut, checkSurveyByIdRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(checkSurveyByIdRepositorySpy, "checkById").mockImplementationOnce(() => throwError())
        const promise = sut.checkById("any_id")
        await expect(promise).rejects.toThrow()
    })
})