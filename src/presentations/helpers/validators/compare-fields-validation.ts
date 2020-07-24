/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from "./validation"
import { InvalidParamError } from "../../errors"

export class CompareFieldsValidation implements Validation {

    constructor(
        private readonly fieldName: string,
        private readonly fieldToCompare: string
    ) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
        if (input[this.fieldName] !== input[this.fieldToCompare]) {
            return new InvalidParamError(this.fieldToCompare)
        }
    }

}