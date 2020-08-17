import { SurveyModel, LoadSurveys } from "./load-surveys-controller-protocols"
import { LoadSurveysController } from "./load-surveys-controller"
import MockDate from "mockdate"
import { ok, serverError, noContent } from "../../../helpers/http/http-helper"
import { throwError } from "../../../../domain/test/"

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

const makeLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {

        async load(): Promise<SurveyModel[]> {
            return Promise.resolve(mockSurveysModel())
        }

    }

    return new LoadSurveysStub()
}

type SutTypes = {
    sut: LoadSurveysController
    loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)

    return {
        sut,
        loadSurveysStub
    }
}

describe("LoadSurveys Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Should call LoadSurveys", async () => {
        const { sut, loadSurveysStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysStub, "load")
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })
    test("Should return 200 on success", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(mockSurveysModel()))
    })
    test("Should return 204 if LoadSurveys returns empty", async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, "load").mockReturnValueOnce(new Promise(resolve => resolve([])))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    })
    test("Shoul return 500 if AddSurvey throws", async () => {
        const { sut, loadSurveysStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveysStub, "load").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
