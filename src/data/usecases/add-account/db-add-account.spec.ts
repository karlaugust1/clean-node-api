import { DbAddAccount } from "./db-add-account"
import { Hasher, AddAccountRepository, AddAccountModel, AccountModel } from "./db-add-account-protocols"

interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {

        // eslint-disable-next-line no-unused-vars
        async hash(_value: string): Promise<string> {
            return Promise.resolve("hashed_password")
        }

    }

    return new HasherStub()
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
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub
    }
}

describe("DbAddAccount UseCase", () => {
    test("Should call Hasher with correct password", async () => {
        const { sut, hasherStub } = makeSut()
        const hashSpy = jest.spyOn(hasherStub, "hash")
        await sut.add(makeFakeDbAccountData())
        expect(hashSpy).toHaveBeenCalledWith("any_password")
    })

    test("Should throw if Hasher throws", async () => {
        const { sut, hasherStub: hasherStub } = makeSut()
        jest.spyOn(hasherStub, "hash").mockReturnValueOnce(new Promise((_resolve, reject) => reject(new Error())))

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
