/* eslint-disable no-unused-vars */
import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../presentations/errors"
import { Validation } from "../../presentations/protocols"

type SutTypes = {
    sut: ValidationComposite
    validationStubs: Validation[]
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
    const validationStubs = [makeValidation(), makeValidation()]
    const sut = new ValidationComposite(validationStubs)

    return {
        sut,
        validationStubs
    }
}

describe("Validation Composite", () => {
    test("Should return an error if any validation fails", () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"))
        const error = sut.validate({ field: "any_value" })
        expect(error).toEqual(new MissingParamError("field"))
    })

    test("Should the first error if more than one validation fails", () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error())
        jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"))
        const error = sut.validate({ field: "any_value" })
        expect(error).toEqual(new Error())
    })

    test("Should not return an error if validation succeeds", () => {
        const { sut } = makeSut()
        const error = sut.validate({ field: "any_value" })
        expect(error).toBeFalsy()
    })
})
