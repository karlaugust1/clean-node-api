import { LogControllerDecorator } from "./log"
import { Controller, HttpResponse, HttpRequest } from "../../presentations/protocols"

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
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

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
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
})
