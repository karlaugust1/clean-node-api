import { SurveyModel, LoadSurveys } from "./load-surveys-controller-protocols"
import { LoadSurveysController } from "./load-surveys-controller"
import MockDate from "mockdate"
import { ok, serverError, noContent } from "../../../helpers/http/http-helper"
import { throwError } from "../../../../domain/test/"
import { mockLoadSurveysSpy } from "../../../test"

const mockRequest = (): LoadSurveysController.Request => ({
    accountId: "any_id"
})
const mockSurveysModel = (): SurveyModel[] => [{
    id: "any_id",
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
}, {
    id: "other_id",
    question: "other_question",
    answers: [{
        image: "other_image",
        answer: "other_answer"
    }],
    date: new Date()
}]

type SutTypes = {
    sut: LoadSurveysController
    loadSurveysSpy: LoadSurveys
}

const makeSut = (): SutTypes => {
    const loadSurveysSpy = mockLoadSurveysSpy()
    const sut = new LoadSurveysController(loadSurveysSpy)

    return {
        sut,
        loadSurveysSpy
    }
}

describe("LoadSurveys Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadSurveys with correct value", async () => {
        const { sut, loadSurveysSpy } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysSpy, "load")
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(loadSpy).toHaveBeenCalledWith(httpRequest.accountId)
    })
    test("Should return 200 on success", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok(mockSurveysModel()))
    })
    test("Should return 204 if LoadSurveys returns empty", async () => {
        const { sut, loadSurveysSpy } = makeSut()
        jest.spyOn(loadSurveysSpy, "load").mockReturnValueOnce(Promise.resolve([]))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(noContent())
    })
    test("Shoul return 500 if AddSurvey throws", async () => {
        const { sut, loadSurveysSpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveysSpy, "load").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
