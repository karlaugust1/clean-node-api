/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from "./validation"

export class ValidationComposite implements Validation {

    private readonly validations: Validation[]

    constructor(validations: Validation[]) {
        this.validations = validations
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validade(input: any): Error {
        for (const validation of this.validations) {
            const error = validation.validade(input)
            if (error) {
                return error
            }
        }
    }

}