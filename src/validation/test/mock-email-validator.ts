import { EmailValidator } from "../protocols/email-validator"

export const mockEmailValidator = (): EmailValidator => {
    class EmailValidatorSpy implements EmailValidator {

        // eslint-disable-next-line no-unused-vars
        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorSpy()
}