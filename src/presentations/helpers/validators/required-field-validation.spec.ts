import { RequiredFieldValidation } from "./required-field-validation"
import { MissingParamError } from "../../errors"

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation("field")

describe("RequiredFiel Validation", () => {
    test("Should return a MissingParamError if validation fails", () => {
        const sut = makeSut()
        const error = sut.validade({ name: "any_name" })
        expect(error).toEqual(new MissingParamError("field"))
    })
    test("Should not return a MissingParamError if validation succeeds", () => {
        const sut = makeSut()
        const error = sut.validade({ field: "any_name" })
        expect(error).toBeFalsy()
    })
})
