import { Validation } from "../../presentations/protocols"

export const mockValidation = (): Validation => {
    class ValidationSpy implements Validation {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_input: any): Error {
            return null
        }

    }

    return new ValidationSpy()
}