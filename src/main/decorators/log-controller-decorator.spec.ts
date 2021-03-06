import { LogControllerDecorator } from "./log-controller-decorator"
import { Controller, HttpResponse, HttpRequest } from "../../presentations/protocols"
import { serverError, ok } from "../../presentations/helpers/http/http-helper"
import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { mockAccountModel } from "../../domain/test"
import { mockLogErrorRepositoryStub } from "../../data/test"

type SutTypes = {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeHttpRequest = (): HttpRequest => ({
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
    class ControllerStub implements Controller {

        // eslint-disable-next-line no-unused-vars
        async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
            return Promise.resolve(ok(mockAccountModel()))
        }

    }
    const controllerStub = new ControllerStub()

    return controllerStub
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = mockLogErrorRepositoryStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}
describe("LogController Decorator", () => {
    test("Should call controller handle", async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, "handle")
        await sut.handle(makeHttpRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
    })

    test("Should return the same result of the controller", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeHttpRequest())
        expect(httpResponse).toEqual(ok(mockAccountModel()))
    })

    test("Should call LogErrorRepository with correct error if controller return a server error", async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")
        jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
            Promise.resolve(mockServerError())
        )
        await sut.handle(makeHttpRequest())
        expect(logSpy).toHaveBeenCalledWith("any_stack")
    })
})
