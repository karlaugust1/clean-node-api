import {
    ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation
} from "../../../presentations/helpers/validators"
import { Validation } from "../../../presentations/helpers/validators/validation"
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter"

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))
    validations.push(new EmailValidation("email", new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
}