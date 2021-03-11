export interface LoadAccountByToken {
    loadByToken(accessToken: string, role?: string): Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
    export type Result = {
        id: string
    }
}