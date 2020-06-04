import { DbAddAccount } from "./db-add-account"

describe("DbAddAccount UseCase", () => {
    test("Should call Encrypter with correct password", async () => {
        class EncrypterStub {

            async encrypt(_value: string): Promise<string> {
                return Promise.resolve("hashed_password")
            }

        }
        const encrypterStub = new EncrypterStub()
        const sut = new DbAddAccount(encrypterStub)
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
