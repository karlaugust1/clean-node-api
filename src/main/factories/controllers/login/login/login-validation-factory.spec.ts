import { makeLoginUpValidation } from "./login-validation-factory"
import { EmailValidator } from "../../../../../validation/protocols/email-validator"
import {
    RequiredFieldValidation, EmailValidation, ValidationComposite
} from "../../../../../validation/validators"
import { Validation } from "../../../../../presentations/protocols"

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

describe("LoginValidation Factory", () => {
    test("should call ValidationComposite with all validations", () => {
        makeLoginUpValidation()
        const validations: Validation[] = []
        for (const field of ["email", "password"]) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new EmailValidation("email", makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
