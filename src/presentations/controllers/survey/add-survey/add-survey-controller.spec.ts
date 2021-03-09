import { AddSurvey, Validation } from "./add-survey-controller-protocols";
import { AddSurveyController } from "./add-survey-controller"
import { badRequest, serverError, noContent } from "../../../helpers/http/http-helper";
import MockDate from "mockdate"
import { throwError } from "../../../../domain/test/"
import { mockValidation, mockAddSurvey } from "../../../test";

const mockRequest = (): AddSurveyController.Request => ({
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }]
})

type SutTypes = {
    sut: AddSurveyController
    validationSpy: Validation
    addSurveySpy: AddSurvey
}

const makeSut = (): SutTypes => {
    const validationSpy = mockValidation()
    const addSurveySpy = mockAddSurvey()
    const sut = new AddSurveyController(validationSpy, addSurveySpy)

    return {
        sut,
        validationSpy,
        addSurveySpy
    }
}

describe("AddSurvey Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test("Shoul call Validation with correct values", async () => {
        const { sut, validationSpy } = makeSut()
        const validateSpy = jest.spyOn(validationSpy, "validate")
        const request = mockRequest()
        await sut.handle(request)
        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test("Shoul return 400 if Validation fails", async () => {
        const { sut, validationSpy } = makeSut()
        jest.spyOn(validationSpy, "validate").mockReturnValueOnce(new Error())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test("Shoul call AddSurvey with correct values", async () => {
        const { sut, addSurveySpy } = makeSut()
        const addSpy = jest.spyOn(addSurveySpy, "add")
        const request = mockRequest()
        await sut.handle(request)
        expect(addSpy).toHaveBeenCalledWith({ ...request, date: new Date() })
    })

    test("Shoul return 500 if AddSurvey throws", async () => {
        const { sut, addSurveySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(addSurveySpy, "add").mockImplementationOnce(() => throwError())
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test("Shoul return 204 on AddSurvey success", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(noContent())
    })
})
