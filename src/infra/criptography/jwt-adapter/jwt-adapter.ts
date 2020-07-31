import jwt from "jsonwebtoken"
import { Encrypter } from "../../../data/protocols/criptograph/encrypter";
import { Decrypter } from "../../../data/protocols/criptograph/decrypter";

export class JwtAdapter implements Encrypter, Decrypter {

    constructor(private readonly secret: string) {
    }

    async encrypt(value: string): Promise<string> {
        const accessToken = jwt.sign({ id: value }, this.secret)

        return Promise.resolve(accessToken)
    }

    async decrypt(token: string): Promise<string> {
        const value: unknown = jwt.verify(token, this.secret)

        return Promise.resolve(value as string)
    }

}