import { DbAddAccount } from "./db-add-account"
import { Encrypter } from "../../protocols/encrypter"

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {

        async encrypt(_value: string): Promise<string> {
            return Promise.resolve("hashed_password")
        }

    }

    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)

    return {
        sut,
        encrypterStub
    }
}

describe("DbAddAccount UseCase", () => {
    test("Should call Encrypter with correct password", async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
        const accountData = {
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password"
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith("any_password")
    })
})
