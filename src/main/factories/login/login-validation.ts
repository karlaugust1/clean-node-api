import { ValidationComposite } from "../../../presentations/helpers/validators/validation-composite"
import { RequiredFieldValidation } from "../../../presentations/helpers/validators/required-field-validation"
import { Validation } from "../../../presentations/helpers/validators/validation"
import { EmailValidation } from "../../../presentations/helpers/validators/email-validation"
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter"

export const makeLoginUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ["email", "password"]) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation("email", new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
}