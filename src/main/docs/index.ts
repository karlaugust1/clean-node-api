import paths from "./paths"
import components from "./components"
import schemas from "./schemas"

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
    paths,
    schemas,
    components
}