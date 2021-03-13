import { adaptResolver } from "../../adapters/apollo-server-resolver-adapter"
import { makeLoginController } from "../../factories/controllers/login/login/login-controller-factory"
import { makeSignUpController } from "../../factories/controllers/login/signup/signup-controller-factory"

/* eslint-disable */
export default {
    Query: {
        login: async (_parent: any, args: any) => adaptResolver(makeLoginController(), args)
    },
    Mutation: {
        signUp: async (_parent: any, args: any) => adaptResolver(makeSignUpController(), args)
    }
}