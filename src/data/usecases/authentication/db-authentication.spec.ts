import { DbAuthentication } from "./db-authentication"
import {
    AccountModel, LoadAccountByEmailRepository, AuthenticationModel,
    HashComparer, Encrypter, UpdateAccessTokenRepository
} from "./db-authentication-protocols"

const makeFaceAccount = (): AccountModel => ({
    id: "any_id",
    name: "any_name",
    email: "any_mail@mail.com",
    password: "hashed_password"
})

const makeFakeAuthentication = (): AuthenticationModel => ({ email: "any_email@mail.com", password: "any_password" })

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {

        // eslint-disable-next-line no-unused-vars
        async loadByEmail(_email: string): Promise<AccountModel> {
            const account: AccountModel = makeFaceAccount()

            return Promise.resolve(account)
        }

    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {

        // eslint-disable-next-line no-unused-vars
        async compare(_value: string, _hash: string): Promise<boolean> {
            return Promise.resolve(true)
        }

    }

    return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {

        // eslint-disable-next-line no-unused-vars
        async encrypt(_value: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {

        // eslint-disable-next-line no-unused-vars
        async updateAccessToken(_id: string, _token: string): Promise<void> {
            return Promise.resolve()
        }

    }

    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const encrypterStub = makeEncrypter()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}
describe("DbAuthentication Usecase", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throw if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null if LoadAccountByEmailRepository returns null", async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(null)
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    test("Should call HashCompare with correct values", async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, "compare")
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password")
    })

    test("Should throw if HashComparer throws", async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    test("Should return null if HashComparer returns false", async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false))
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    test("Should call Encrypter with correct id", async () => {
        const { sut, encrypterStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, "encrypt")
        await sut.auth(makeFakeAuthentication())
        expect(generateSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should throw if Encrypter throws", async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    test("Should return an accessToken if login succeeds", async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe("any_token")
    })

    test("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token")
    })

    test("Should throw if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
            .mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
})
