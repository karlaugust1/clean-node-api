import { makeLoginUpValidation } from "./login-validation-factory"
import { EmailValidator } from "../../../../presentations/protocols/email-validator"
import {
    RequiredFieldValidation, EmailValidation, ValidationComposite
} from "../../../../presentations/helpers/validators"
import { Validation } from "../../../../presentations/helpers/validators/validation"

jest.mock("../../../../presentations/helpers/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {

        // eslint-disable-next-line no-unused-vars
        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorStub()
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
