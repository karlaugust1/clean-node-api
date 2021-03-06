import { makeSignUpValidation } from "./signup-validation-factory"
import {
    ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation
} from "../../../../../validation/validators"
import { Validation } from "../../../../../presentations/protocols"
import { EmailValidator } from "../../../../../validation/protocols/email-validator"

jest.mock("../../../../../validation/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorSpy implements EmailValidator {

        // eslint-disable-next-line no-unused-vars
        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorSpy()
}

describe("SignUpValidation Factory", () => {
    test("should call ValidationComposite with all validations", () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        for (const field of ["name", "email", "password", "passwordConfirmation"]) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))
        validations.push(new EmailValidation("email", makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
