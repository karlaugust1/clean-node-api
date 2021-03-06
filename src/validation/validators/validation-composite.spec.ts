/* eslint-disable no-unused-vars */
import { ValidationComposite } from "./validation-composite"
import { MissingParamError } from "../../presentations/errors"
import { Validation } from "../../presentations/protocols"
import { mockValidation } from "../test"

type SutTypes = {
    sut: ValidationComposite
    validationSpys: Validation[]
}

const makeSut = (): SutTypes => {
    const validationSpys = [mockValidation(), mockValidation()]
    const sut = new ValidationComposite(validationSpys)

    return {
        sut,
        validationSpys
    }
}

describe("Validation Composite", () => {
    test("Should return an error if any validation fails", () => {
        const { sut, validationSpys } = makeSut()
        jest.spyOn(validationSpys[1], "validate").mockReturnValueOnce(new MissingParamError("field"))
        const error = sut.validate({ field: "any_value" })
        expect(error).toEqual(new MissingParamError("field"))
    })

    test("Should the first error if more than one validation fails", () => {
        const { sut, validationSpys } = makeSut()
        jest.spyOn(validationSpys[0], "validate").mockReturnValueOnce(new Error())
        jest.spyOn(validationSpys[1], "validate").mockReturnValueOnce(new MissingParamError("field"))
        const error = sut.validate({ field: "any_value" })
        expect(error).toEqual(new Error())
    })

    test("Should not return an error if validation succeeds", () => {
        const { sut } = makeSut()
        const error = sut.validate({ field: "any_value" })
        expect(error).toBeFalsy()
    })
})
