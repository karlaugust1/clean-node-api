import { LogControllerDecorator } from "./log"
import { Controller, HttpResponse, HttpRequest } from "../../presentations/protocols"

describe("LogController Decorator", () => {
    test("Should call controller handle", async () => {
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
        const handleSpy = jest.spyOn(controllerStub, "handle")
        const sut = new LogControllerDecorator(controllerStub)
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
