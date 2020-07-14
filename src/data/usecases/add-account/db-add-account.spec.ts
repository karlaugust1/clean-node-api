import { DbAddAccount } from "./db-add-account"
import { Encrypter, AddAccountRepository, AddAccountModel, AccountModel } from "./db-add-account-protocols"

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {

        // eslint-disable-next-line no-unused-vars
        async encrypt(_value: string): Promise<string> {
            return Promise.resolve("hashed_password")
        }

    }

    return new EncrypterStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "hashed_password"
})

const makeFakeDbAccountData = (): AddAccountModel => ({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password"
})

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {

        // eslint-disable-next-line no-unused-vars
        async add(_accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }

    }

    return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe("DbAddAccount UseCase", () => {
    test("Should call Encrypter with correct password", async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
        await sut.add(makeFakeDbAccountData())
        expect(encryptSpy).toHaveBeenCalledWith("any_password")
    })

    test("Should throw if Encrypter throws", async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))

        const promise = sut.add(makeFakeDbAccountData())
        await expect(promise).rejects.toThrow()
    })

    test("Should call AddAccountRepository with correct values", async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, "add")
        await sut.add(makeFakeDbAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "hashed_password"
        })
    })

    test("Should throw if AddAccountRepository throws", async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, "add")
            .mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))

        const promise = sut.add(makeFakeDbAccountData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return an account on success", async () => {
        const { sut } = makeSut()

        const account = await sut.add(makeFakeDbAccountData())
        expect(account).toEqual(makeFakeAccount())
    })
})
