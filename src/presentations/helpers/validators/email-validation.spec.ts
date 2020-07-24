import { EmailValidation } from "./email-validation"
import { EmailValidator } from "../../protocols/email-validator"
import { InvalidParamError } from "../../errors"

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {

        // eslint-disable-next-line no-unused-vars
        isValid(_email: string): boolean {
            return true
        }

    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation("email", emailValidatorStub)

    return {
        sut,
        emailValidatorStub
    }
}

describe("Email Validation", () => {
    test("Should return an error if EmailValidator returns false", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
        const error = sut.validate({ email: "any_email@mail.com" })
        expect(error).toEqual(new InvalidParamError("email"))
    })
    test("Should call EmailValidator with correct email", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
        sut.validate({ email: "any_email@mail.com" })
        expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throw if EmailValidator throws", () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(sut.validate).toThrow()
    })
})