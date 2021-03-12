import { DbAddAccount } from "./db-add-account"
import {
    Hasher, AddAccountRepository, CheckAccountByEmailRepository
} from "./db-add-account-protocols"
import { mockAccountModel, mockAddAccountParams, throwError } from "../../../../domain/test/"
import { mockHasher, mockAddAccountRepository, mockCheckAccountByEmailRepository } from "../../../../data/test"

type SutTypes = {
    sut: DbAddAccount
    hasherSpy: Hasher
    addAccountRepositorySpy: AddAccountRepository
    checkAccountByEmailRepositorySpy: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherSpy = mockHasher()
    const addAccountRepositorySpy = mockAddAccountRepository()
    const checkAccountByEmailRepositorySpy = mockCheckAccountByEmailRepository()
    const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)

    return {
        sut,
        hasherSpy,
        addAccountRepositorySpy,
        checkAccountByEmailRepositorySpy
    }
}

describe("DbAddAccount UseCase", () => {
    test("Should call Hasher with correct password", async () => {
        const { sut, hasherSpy } = makeSut()
        const hashSpy = jest.spyOn(hasherSpy, "hash")
        await sut.add(mockAddAccountParams())
        expect(hashSpy).toHaveBeenCalledWith("any_password")
    })

    test("Should throw if Hasher throws", async () => {
        const { sut, hasherSpy: hasherSpy } = makeSut()
        jest.spyOn(hasherSpy, "hash").mockImplementationOnce(() => throwError())

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRepositorySpy } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositorySpy, "add")
        await sut.add(mockAddAccountParams())
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "hashed_password"
        })
    })

    test("Should throw if AddAccountRepository throws", async () => {
        const { sut, addAccountRepositorySpy } = makeSut()
        jest.spyOn(addAccountRepositorySpy, "add")
            .mockImplementationOnce(() => throwError())

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("Should return true on success", async () => {
        const { sut } = makeSut()

        const account = await sut.add(mockAddAccountParams())
        expect(account).toBe(true)
    })
    test("Should return false if AddAccountRepository returns false", async () => {
        const { sut, addAccountRepositorySpy } = makeSut()
        jest.spyOn(addAccountRepositorySpy, "add").mockReturnValueOnce(Promise.resolve(false))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBe(false)
    })

    test("Should call CheckAccountByEmailRepository with correct email", async () => {
        const { sut, checkAccountByEmailRepositorySpy } = makeSut()
        const loadSpy = jest.spyOn(checkAccountByEmailRepositorySpy, "checkByEmail")
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should return false if CheckAccountByEmailRepository returns true", async () => {
        const { sut, checkAccountByEmailRepositorySpy } = makeSut()
        const mock = mockAccountModel()
        delete mock.email
        // eslint-disable-next-line max-len
        jest.spyOn(checkAccountByEmailRepositorySpy, "checkByEmail").mockReturnValueOnce(Promise.resolve(true))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBe(false)
    })
})
