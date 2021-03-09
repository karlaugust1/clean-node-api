import { LogControllerDecorator } from "./log-controller-decorator"
import { Controller, HttpResponse } from "../../presentations/protocols"
import { serverError, ok } from "../../presentations/helpers/http/http-helper"
import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { mockAccountModel } from "../../domain/test"
import { mockLogErrorRepositorySpy } from "../../data/test"

type SutTypes = {
    sut: LogControllerDecorator
    controllerSpy: Controller
    logErrorRepositorySpy: LogErrorRepository
}

const makeRequest = (): unknown => ({
    body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
    }
})

const mockServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = "any_stack"

    return serverError(fakeError)
}

const makeController = (): Controller => {
    class ControllerSpy implements Controller {

        // eslint-disable-next-line no-unused-vars
        async handle(_request: unknown): Promise<HttpResponse> {
            return Promise.resolve(ok(mockAccountModel()))
        }

    }
    const controllerSpy = new ControllerSpy()

    return controllerSpy
}

const makeSut = (): SutTypes => {
    const controllerSpy = makeController()
    const logErrorRepositorySpy = mockLogErrorRepositorySpy()
    const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

    return {
        sut,
        controllerSpy,
        logErrorRepositorySpy
    }
}
describe("LogController Decorator", () => {
    test("Should call controller handle", async () => {
        const { sut, controllerSpy } = makeSut()
        const handleSpy = jest.spyOn(controllerSpy, "handle")
        await sut.handle(makeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeRequest())
    })

    test("Should return the same result of the controller", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeRequest())
        expect(httpResponse).toEqual(ok(mockAccountModel()))
    })

    test("Should call LogErrorRepository with correct error if controller return a server error", async () => {
        const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositorySpy, "logError")
        jest.spyOn(controllerSpy, "handle").mockReturnValueOnce(
            Promise.resolve(mockServerError())
        )
        await sut.handle(makeRequest())
        expect(logSpy).toHaveBeenCalledWith("any_stack")
    })
})
