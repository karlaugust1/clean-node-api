import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/criptograph/decrypter";
import { AccountModel } from "../../../domain/models/account";

export class DbLoadAccountByToken implements LoadAccountByToken {

    constructor(
        private readonly decrypter: Decrypter
    ) { }

    async load(accessToken: string, _role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken)

        return null
    }

}