import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, SurveyModel, LoadSurveyById } from "./save-survey-result-controller-protocols"
import { forbidden, serverError } from "../../../helpers/http/http-helper"
import { InvalidParamError } from "../../../errors"

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: "any_survey_id"
    },
    body: {
        asnwer: "any_answer"
    }
})

const makeFakeSurvey = (): SurveyModel => ({
    id: "any_id",
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {

        async loadById(_id: string): Promise<SurveyModel> {
            return Promise.resolve(makeFakeSurvey())
        }

    }

    return new LoadSurveyByIdStub()
}

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)

    return {
        sut,
        loadSurveyByIdStub
    }
}

describe("SaveSurveyResult Controller", () => {
    test("Should call LoadSurveyById with correc values", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, "loadById")
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith("any_survey_id")
    })
    test("Should return 403 if LoadSurveyById returns null", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")))
    })
    test("Shoul return 500 if LoadSurveyById throws", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test("Should return 403 if an invalid answer is provided", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({
            params: {
                surveyId: "any_survey_id"
            },
            body: {
                asnwer: "invalid_answer"
            }
        })
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")))
    })
})
