import { SaveSurveyResultController } from "./save-survey-result-controller"
import {
    LoadAnswersBySurvey, SaveSurveyResult
} from "./save-survey-result-controller-protocols"
import { forbidden, serverError, ok } from "../../../helpers/http/http-helper"
import { InvalidParamError } from "../../../errors"
import MockDate from "mockdate"
import { throwError, mockSurveyResultModel } from "../../../../domain/test/"
import { mockSaveSurveyResult, mockLoadAnswersBySurvey } from "../../../test"

const mockRequest = (): SaveSurveyResultController.Request => ({
    surveyId: "any_survey_id",
    answer: "any_answer",
    accountId: "any_account_id"
})

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdSpy: LoadAnswersBySurvey
    saveSurveyResultSpy: SaveSurveyResult
}

const makeSut = (): SutTypes => {
    const loadAnswersBySurvey = mockLoadAnswersBySurvey()
    const saveSurveyResultSpy = mockSaveSurveyResult()
    const sut = new SaveSurveyResultController(loadAnswersBySurvey, saveSurveyResultSpy)

    return {
        sut,
        loadSurveyByIdSpy: loadAnswersBySurvey,
        saveSurveyResultSpy
    }
}

describe("SaveSurveyResult Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadAnswersBySurvey with correct values", async () => {
        const { sut, loadSurveyByIdSpy } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, "loadAnswers")
        await sut.handle(mockRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id")
    })
    test("Should return 403 if LoadAnswersBySurvey returns null", async () => {
        const { sut, loadSurveyByIdSpy } = makeSut()
        jest.spyOn(loadSurveyByIdSpy, "loadAnswers").mockReturnValueOnce(Promise.resolve([]))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")))
    })
    test("Shoul return 500 if LoadAnswersBySurvey throws", async () => {
        const { sut, loadSurveyByIdSpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyByIdSpy, "loadAnswers").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test("Should return 403 if an invalid answer is provided", async () => {
        const { sut } = makeSut()
        const request = mockRequest()
        request.answer = "invalid_answer"
        const httpResponse = await sut.handle({
            surveyId: "any_survey_id",
            answer: "invalid_answer",
            accountId: "any_account_id"

        })
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")))
    })
    test("Should call SaveSurveyResult with correct values", async () => {
        const { sut, saveSurveyResultSpy } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultSpy, "save")
        await sut.handle(mockRequest())
        expect(saveSpy).toHaveBeenCalledWith({
            surveyId: "any_survey_id",
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer"
        })
    })
    test("Shoul return 500 if SaveSurveyResult throws", async () => {
        const { sut, saveSurveyResultSpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(saveSurveyResultSpy, "save").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test("Shoul return 200 on success", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
    })
})
