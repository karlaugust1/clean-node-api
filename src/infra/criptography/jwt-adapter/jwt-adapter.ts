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

    async decrypt(value: string): Promise<string> {
        jwt.verify(value, this.secret)

        return Promise.resolve("null")
    }

}