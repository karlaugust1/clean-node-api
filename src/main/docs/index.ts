import { loginPath } from "./paths"
import { badRequest, unauthorized, serverError, notFound } from "./components"
import { accountSchema, loginParamsSchema, errorSchema } from "./schemas"

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
    }],
    paths: {
        "/login": loginPath
    },
    schemas: {
        account: accountSchema,
        loginParams: loginParamsSchema,
        error: errorSchema
    },
    components: {
        badRequest,
        unauthorized,
        serverError,
        notFound
    }
}