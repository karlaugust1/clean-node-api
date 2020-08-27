import { loginPath, surveyPath, signupPath } from "./paths"
import { badRequest, unauthorized, serverError, notFound, forbidden } from "./components"
import {
    accountSchema, loginParamsSchema, errorSchema, surveyAnswerSchema, surveySchema, surveysSchema,
    apiKeyAuthSchema, signupParamsSchema
} from "./schemas"

export default {
    openapi: "3.0.0",
    info: {
        title: "Clean Node API",
        description: "API com arquitetura limpa para cadastro de enquetes!",
        version: "1.0.0"
    },
    license: {
        name: "GNU General Public License v3.0 or later",
        url: "https://spdx.org/licenses/GPL-3.0-or-later.html"
    },
    servers: [{
        url: "/api"
    }],
    tags: [{
        name: "Login"
    }, {
        name: "Enquete"
    }],
    paths: {
        "/login": loginPath,
        "/signup": signupPath,
        "/surveys": surveyPath
    },
    schemas: {
        account: accountSchema,
        loginParams: loginParamsSchema,
        signupParams: signupParamsSchema,
        error: errorSchema,
        surveyAnswer: surveyAnswerSchema,
        survey: surveySchema,
        surveys: surveysSchema
    },
    components: {
        securitySchemes: {
            apiKeyAuth: apiKeyAuthSchema
        },
        badRequest,
        unauthorized,
        serverError,
        notFound,
        forbidden
    }
}