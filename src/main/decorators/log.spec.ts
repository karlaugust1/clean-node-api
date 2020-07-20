import { LogControllerDecorator } from "./log"
import { Controller, HttpResponse, HttpRequest } from "../../presentations/protocols"
import { serverError, ok } from "../../presentations/helpers/http/http-helper"
import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { AccountModel } from "../../domain/models/account"

interface SutTypes {
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

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password"
})

const makeFakeError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = "any_stack"

    return serverError(fakeError)
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {

        // eslint-disable-next-line no-unused-vars
        async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve(ok(makeFakeAccount())))
        }

    }
    const controllerStub = new ControllerStub()

    return controllerStub
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {

        // eslint-disable-next-line no-unused-vars
        async logError(_stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }

    }

    return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
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
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test("Should call LogErrorRepository with correct error if controller return a server error", async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")
        jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
            new Promise(resolve => resolve(makeFakeError()))
        )
        await sut.handle(makeHttpRequest())
        expect(logSpy).toHaveBeenCalledWith("any_stack")
    })
})
