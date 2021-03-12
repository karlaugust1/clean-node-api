import { LoadAnswersBySurvey, LoadSurveyResult } from "./load-survey-result-controller-protocols"
import { LoadSurveyResultController } from "./load-survey-result-controller"
import { mockLoadAnswersBySurvey, mockLoadSurveyResult } from "../../../../presentations/test"
import { forbidden, ok, serverError } from "../../../helpers/http/http-helper"
import { InvalidParamError } from "../../../errors"
import { mockSurveyResultModel, throwError } from "../../../../domain/test"
import MockDate from "mockdate"

const mockRequest = (): LoadSurveyResultController.Request => ({
    accountId: "any_id",
    surveyId: "any_id"
})

type SutTypes = {
    sut: LoadSurveyResultController
    loadAnswersBySurvey: LoadAnswersBySurvey
    loadSurveyResultSpy: LoadSurveyResult
}

const makeSut = (): SutTypes => {
    const loadAnswersBySurvey = mockLoadAnswersBySurvey()
    const loadSurveyResultSpy = mockLoadSurveyResult()
    const sut = new LoadSurveyResultController(loadAnswersBySurvey, loadSurveyResultSpy)

    return {
        sut,
        loadAnswersBySurvey,
        loadSurveyResultSpy
    }
}
describe("LoadSurveyResult Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadAnswersBySurvey with correct value", async () => {
        const { sut, loadAnswersBySurvey: loadSurveyByIdSpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, "loadAnswers")
        await sut.handle(mockRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return 403 if LoadAnswersBySurvey returns null", async () => {
        const { sut, loadAnswersBySurvey: loadSurveyByIdSpy } = makeSut()
        jest.spyOn(loadSurveyByIdSpy, "loadAnswers").mockReturnValueOnce(Promise.resolve([]))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")))
    })

    test("Should return 500 if LoadAnswersBySurvey throws", async () => {
        const { sut, loadAnswersBySurvey: loadSurveyByIdSpy } = makeSut()
        jest.spyOn(loadSurveyByIdSpy, "loadAnswers").mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Should call LoadSurveyResult with correct value", async () => {
        const { sut, loadSurveyResultSpy } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyResultSpy, "load")
        await sut.handle(mockRequest())
        expect(loadSpy).toHaveBeenCalledWith("any_id", "any_id")
    })

    test("Should return 500 if LoadSurveyResult throws", async () => {
        const { sut, loadSurveyResultSpy } = makeSut()
        jest.spyOn(loadSurveyResultSpy, "load").mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test("Should return 200 on sucess", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
    })
})
