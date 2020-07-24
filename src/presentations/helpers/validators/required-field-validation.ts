/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from "./validation"
import { MissingParamError } from "../../errors"

export class RequiredFieldValidation implements Validation {

    constructor(private readonly fieldName: string) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }
    }

}