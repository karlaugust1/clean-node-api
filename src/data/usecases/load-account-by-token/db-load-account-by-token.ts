import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/criptograph/decrypter";
import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";

export class DbLoadAccountByToken implements LoadAccountByToken {

    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) { }

    async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            const account = await this.loadAccountByTokenRepository.loadByToken(token, role)

            return account
        }

        return null
    }

}