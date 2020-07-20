import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../errors"
import { Validation } from "./validation"

interface SutTypes {
    sut: ValidationComposite
    validationStub: Validation
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_input: any): Error {
            return null
        }

    }

    return new ValidationStub()
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const sut = new ValidationComposite([validationStub])

    return {
        sut,
        validationStub
    }
}

describe("Validation Composite", () => {
    test("Should return an error if any validation fails", () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("field"))
        const error = sut.validate({ field: "any_value" })
        expect(error).toEqual(new MissingParamError("field"))
    })
})
