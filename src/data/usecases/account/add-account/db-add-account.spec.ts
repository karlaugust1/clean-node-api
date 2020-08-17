import { DbAddAccount } from "./db-add-account"
import {
    Hasher, AddAccountRepository, AccountModel, LoadAccountByEmailRepository
} from "./db-add-account-protocols"
import { mockAccountModel, mockAddAccountParams, throwError } from "../../../../domain/test/"
import { mockHasher, mockAddAccountRepository } from "../../../../data/test"

type SutTypes = {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {

        // eslint-disable-next-line no-unused-vars
        async loadByEmail(_email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(null))
        }

    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
    const hasherStub = mockHasher()
    const addAccountRepositoryStub = mockAddAccountRepository()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

describe("DbAddAccount UseCase", () => {
    test("Should call Hasher with correct password", async () => {
        const { sut, hasherStub } = makeSut()
        const hashSpy = jest.spyOn(hasherStub, "hash")
        await sut.add(mockAddAccountParams())
        expect(hashSpy).toHaveBeenCalledWith("any_password")
    })

    test("Should throw if Hasher throws", async () => {
        const { sut, hasherStub: hasherStub } = makeSut()
        jest.spyOn(hasherStub, "hash").mockImplementationOnce(() => throwError())

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add")
        await sut.add(mockAddAccountParams())
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "hashed_password"
        })
    })

    test("Should throw if AddAccountRepository throws", async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, "add")
            .mockImplementationOnce(() => throwError())

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow()
    })

    test("Should return an account on success", async () => {
        const { sut } = makeSut()

        const account = await sut.add(mockAddAccountParams())
        expect(account).toEqual(mockAccountModel())
    })

    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should return null if LoadAccountByEmailRepository not return null", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(Promise.resolve(mockAccountModel()))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBeNull()
    })
})
