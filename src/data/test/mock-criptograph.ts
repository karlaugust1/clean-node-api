import { Hasher } from "../protocols/criptograph/hasher"
import { Decrypter } from "../protocols/criptograph/decrypter"
import { Encrypter } from "../protocols/criptograph/encrypter"
import { HashComparer } from "../protocols/criptograph/hash-comparer"

export const mockHasher = (): Hasher => {
    class HasherStub implements Hasher {

        // eslint-disable-next-line no-unused-vars
        async hash(_value: string): Promise<string> {
            return Promise.resolve("hashed_password")
        }

    }

    return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {

        async decrypt(_value: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {

        // eslint-disable-next-line no-unused-vars
        async encrypt(_value: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {

        // eslint-disable-next-line no-unused-vars
        async compare(_value: string, _hash: string): Promise<boolean> {
            return Promise.resolve(true)
        }

    }

    return new HashComparerStub()
}
