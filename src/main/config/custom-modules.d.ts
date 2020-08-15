// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
declare module Express {
    interface Request {
        accountId?: string
    }
}