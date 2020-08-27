export const signupParamsSchema = {
    type: "object",
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        passwordConfirmation: {
            type: "string"
        },
        name: {
            type: "string"
        }
    },
    required: ["name", "passwordConfirmation", "email", "password"]
}