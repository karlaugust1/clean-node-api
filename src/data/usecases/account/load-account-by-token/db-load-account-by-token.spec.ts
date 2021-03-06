import { Decrypter, LoadAccountByTokenRepository } from "./db-load-account-by-token-protocols"
import { DbLoadAccountByToken } from "./db-load-account-by-token"
import { throwError, mockAccountModel } from "../../../../domain/test/"
import { mockDecrypter, mockLoadAccountByTokenRepository } from "../../../../data/test"

type SutTypes = {
    sut: DbLoadAccountByToken
    decrypterSpy: Decrypter
    loadAccountByTokenRepositorySpy: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
    const decrypterSpy = mockDecrypter()
    const loadAccountByTokenRepositorySpy = mockLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)

    return {
        sut,
        decrypterSpy,
        loadAccountByTokenRepositorySpy
    }
}

describe("DbLoadAccountByToken Usecase", () => {
    test("Should call Decrypter with correct values", async () => {
        const { sut, decrypterSpy } = makeSut()
        const decryptSpy = jest.spyOn(decrypterSpy, "decrypt")
        await sut.loadByToken("any_token", "any_role")
        expect(decryptSpy).toHaveBeenCalledWith("any_token")
    })

    test("Should return null if Decrypter return null", async () => {
        const { sut, decrypterSpy } = makeSut()
        jest.spyOn(decrypterSpy, "decrypt").mockReturnValueOnce(Promise.resolve(null))
        const account = await sut.loadByToken("any_token", "any_role")
        expect(account).toBeNull()
    })

    test("Should call LoadAccountByTokenRepository with correct values", async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositorySpy, "loadByToken")
        await sut.loadByToken("any_token", "any_role")
        expect(loadByTokenSpy).toHaveBeenCalledWith("any_token", "any_role")
    })

    test("Should return null if LoadAccountByTokenRepository return null", async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut()
        jest.spyOn(loadAccountByTokenRepositorySpy, "loadByToken").mockReturnValueOnce(Promise.resolve(null))
        const account = await sut.loadByToken("any_token", "any_role")
        expect(account).toBeNull()
    })

    test("Should return an account on success", async () => {
        const { sut } = makeSut()
        const account = await sut.loadByToken("any_token", "any_role")
        expect(account).toEqual(mockAccountModel())
    })

    test("Should throw if Decrypter throws", async () => {
        const { sut, decrypterSpy } = makeSut()
        jest.spyOn(decrypterSpy, "decrypt").mockImplementationOnce(() => throwError())

        const promise = sut.loadByToken("any_token", "any_role")
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if LoadAccountByTokenRepository throws", async () => {
        const { sut, loadAccountByTokenRepositorySpy } = makeSut()
        // eslint-disable-next-line max-len
        jest.spyOn(loadAccountByTokenRepositorySpy, "loadByToken").mockImplementationOnce(() => throwError())

        const promise = sut.loadByToken("any_token", "any_role")
        await expect(promise).rejects.toThrow()
    })
})
