import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../errors"
import { Validation } from "./validation"

describe("Validation Composite", () => {
    test("Should return an error if any validation fails", () => {
        class ValidationStub implements Validation {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validade(_input: any): Error {
                return new MissingParamError("field")
            }

        }
        const validationStub = new ValidationStub()
        const sut = new ValidationComposite([validationStub])
        const error = sut.validade({ field: "any_value" })
        expect(error).toEqual(new MissingParamError("field"))
    })
})
