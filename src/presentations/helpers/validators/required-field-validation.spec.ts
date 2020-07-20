import { RequiredFieldValidation } from "./required-field-validation"
import { MissingParamError } from "../../errors"

describe("RequiredFiel Validation", () => {
    test("Should return a MissingParamError if validation fails", () => {
        const sut = new RequiredFieldValidation("field")
        const error = sut.validade({ name: "any_name" })
        expect(error).toEqual(new MissingParamError("field"))
    })
})
