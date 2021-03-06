import { EmailValidation } from "./email-validation"
import { EmailValidator } from "../protocols/email-validator"
import { InvalidParamError } from "../../presentations/errors"
import { mockEmailValidator } from "../test"

type SutTypes = {
    sut: EmailValidation
    emailValidatorSpy: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorSpy = mockEmailValidator()
    const sut = new EmailValidation("email", emailValidatorSpy)

    return {
        sut,
        emailValidatorSpy
    }
}

describe("Email Validation", () => {
    test("Should return an error if EmailValidator returns false", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorSpy } = makeSut()
        jest.spyOn(emailValidatorSpy, "isValid").mockReturnValueOnce(false)
        const error = sut.validate({ email: "any_email@mail.com" })
        expect(error).toEqual(new InvalidParamError("email"))
    })
    test("Should call EmailValidator with correct email", () => {
        // SUT == System Under Test => Class that we are testing
        const { sut, emailValidatorSpy } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorSpy, "isValid")
        sut.validate({ email: "any_email@mail.com" })
        expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throw if EmailValidator throws", () => {
        const { sut, emailValidatorSpy } = makeSut()
        jest.spyOn(emailValidatorSpy, "isValid").mockImplementationOnce(() => {
            throw new Error()
        })
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(sut.validate).toThrow()
    })
})
