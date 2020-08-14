/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpResponse = {
    statusCode: number
    body: any
}

export type HttpRequest = {
    body?: any
    headers?: any
    params?: any
}