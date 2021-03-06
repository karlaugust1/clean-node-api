import { Hasher } from "../protocols/criptograph/hasher"
import { Decrypter } from "../protocols/criptograph/decrypter"
import { Encrypter } from "../protocols/criptograph/encrypter"
import { HashComparer } from "../protocols/criptograph/hash-comparer"

export const mockHasher = (): Hasher => {
    class HasherSpy implements Hasher {

        // eslint-disable-next-line no-unused-vars
        async hash(_value: string): Promise<string> {
            return Promise.resolve("hashed_password")
        }

    }

    return new HasherSpy()
}

export const mockDecrypter = (): Decrypter => {
    class DecrypterSpy implements Decrypter {

        async decrypt(_value: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new DecrypterSpy()
}

export const mockEncrypter = (): Encrypter => {
    class EncrypterSpy implements Encrypter {

        // eslint-disable-next-line no-unused-vars
        async encrypt(_value: string): Promise<string> {
            return Promise.resolve("any_token")
        }

    }

    return new EncrypterSpy()
}

export const mockHashComparer = (): HashComparer => {
    class HashComparerSpy implements HashComparer {

        // eslint-disable-next-line no-unused-vars
        async compare(_value: string, _hash: string): Promise<boolean> {
            return Promise.resolve(true)
        }

    }

    return new HashComparerSpy()
}
