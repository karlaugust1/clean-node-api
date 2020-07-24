import { makeSignUpValidation } from "./signup-validation-factory"
import {
    ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation
} from "../../../presentations/helpers/validators"
import { Validation } from "../../../presentations/helpers/validators/validation"
import { EmailValidator } from "../../../presentations/protocols/email-validator"

jest.mock("../../../presentations/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {

        // eslint-disable-next-line no-unused-vars
        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorStub()
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
