import { HttpRequest, AddSurvey, AddSurveyModel, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller"
import { badRequest, serverError, noContent } from "../../../helpers/http/http-helper";

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: "any_question",
        answers: [{
            image: "any_image",
            answer: "any_answer"
        }]
    }
})

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_input: any): Error {
            return null
        }

    }

    return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async add(_data: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve())
        }

    }

    return new AddSurveyStub()
}

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const addSurveyStub = makeAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)

    return {
        sut,
        validationStub,
        addSurveyStub
    }
}

describe("AddSurvey Controller", () => {
    test("Shoul call Validation with correct values", async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, "validate")
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test("Shoul return 400 if Validation fails", async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error())
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test("Shoul call AddSurvey with correct values", async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, "add")
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test("Shoul return 500 if AddSurvey throws", async () => {
        const { sut, addSurveyStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(addSurveyStub, "add").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Shoul return 204 on AddSurvey success", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(noContent())
    })
})