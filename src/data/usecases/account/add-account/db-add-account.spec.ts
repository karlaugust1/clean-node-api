import { DbAddAccount } from "./db-add-account"
import {
    Hasher, AddAccountRepository, LoadAccountByEmailRepository
} from "./db-add-account-protocols"
import { mockAccountModel, mockAddAccountParams, throwError } from "../../../../domain/test/"
import { mockHasher, mockAddAccountRepository, mockLoadAccountByEmailRepository } from "../../../../data/test"

type SutTypes = {
    sut: DbAddAccount
    hasherSpy: Hasher
    addAccountRepositorySpy: AddAccountRepository
    loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherSpy = mockHasher()
    const addAccountRepositorySpy = mockAddAccountRepository()
    const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository()
    jest.spyOn(loadAccountByEmailRepositorySpy, "loadByEmail").mockReturnValue(Promise.resolve(null))
    const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)

    return {
        sut,
        hasherSpy,
        addAccountRepositorySpy,
        loadAccountByEmailRepositorySpy
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

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, "loadByEmail")
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should return null if LoadAccountByEmailRepository not return null", async () => {
        const { sut, loadAccountByEmailRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadAccountByEmailRepositorySpy, "loadByEmail").mockReturnValueOnce(Promise.resolve(mockAccountModel()))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBe(false)
    })
})
