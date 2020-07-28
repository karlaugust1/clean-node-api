/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from "../../presentations/protocols"

export class ValidationComposite implements Validation {

    constructor(private readonly validations: Validation[]) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
        for (const validation of this.validations) {
            const error = validation.validate(input)
            if (error) {
                return error
            }
        }
    }

}