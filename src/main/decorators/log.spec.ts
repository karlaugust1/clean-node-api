import { LogControllerDecorator } from "./log"
import { Controller, HttpResponse, HttpRequest } from "../../presentations/protocols"
import { serverError } from "../../presentations/helpers/http-helper"
import { LogErrorRepository } from "../../data/protocols/log-error-repository"

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {

        async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: "any_name"
                }
            }

            return new Promise(resolve => resolve(httpResponse))
        }

    }
    const controllerStub = new ControllerStub()

    return controllerStub
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {

        async log(_stack: string): Promise<void> {
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
        const httRequest = {
            body: {
                email: "",
                name: "",
                password: "",
                passwordConfirmation: ""
            }
        }
        await sut.handle(httRequest)
        expect(handleSpy).toHaveBeenCalledWith(httRequest)
    })
    test("Should return the same result of the controller", async () => {
        const { sut } = makeSut()
        const httRequest = {
            body: {
                email: "any_name",
                name: "any_mail@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        const httpResponse = await sut.handle(httRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: "any_name"
            }
        })
    })
    test("Should call LogErrorRepository with correct error if controller return a server error", async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const fakeError = new Error()
        fakeError.stack = "any_stack"
        const logSpy = jest.spyOn(logErrorRepositoryStub, "log")
        jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
            new Promise(resolve => resolve(serverError(fakeError)))
        )

        const httRequest = {
            body: {
                email: "any_name",
                name: "any_mail@mail.com",
                password: "any_password",
                passwordConfirmation: "any_password"
            }
        }
        await sut.handle(httRequest)
        expect(logSpy).toHaveBeenCalledWith("any_stack")
    })
})
