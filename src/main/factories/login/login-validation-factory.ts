import {
    ValidationComposite, RequiredFieldValidation, EmailValidation
} from "../../../presentations/helpers/validators"
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter"
import { Validation } from "../../../presentations/helpers/validators/validation"

export const makeLoginUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ["email", "password"]) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation("email", new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
}