import { LogErrorRepository } from "../protocols/db/log/log-error-repository"

export const mockLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {

        // eslint-disable-next-line no-unused-vars
        async logError(_stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }

    }

    return new LogErrorRepositoryStub()
}