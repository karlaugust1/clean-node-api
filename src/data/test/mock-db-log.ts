import { LogErrorRepository } from "../protocols/db/log/log-error-repository"

export const mockLogErrorRepositorySpy = (): LogErrorRepository => {
    class LogErrorRepositorySpy implements LogErrorRepository {

        // eslint-disable-next-line no-unused-vars
        async logError(_stack: string): Promise<void> {
            return Promise.resolve()
        }

    }

    return new LogErrorRepositorySpy()
}