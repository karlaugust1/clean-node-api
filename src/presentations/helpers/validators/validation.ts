export interface Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validade(input: any): Error
}