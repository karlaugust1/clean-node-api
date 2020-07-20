/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from "./validation"
import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols/email-validator"

export class EmailValidation implements Validation {

    private readonly emailValidator: EmailValidator
    private readonly fieldName: string

    constructor(fieldName: string, emailValidator: EmailValidator) {
        this.fieldName = fieldName
        this.emailValidator = emailValidator
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
        const isValid = this.emailValidator.isValid(input[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
    }

}