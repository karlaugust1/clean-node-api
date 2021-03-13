/* eslint-disable */
import { ApolloServer } from "apollo-server-express"
import { Express } from "express"

import typeDefs from "../graphql/type-defs"
import resolvers from "../graphql/resolvers"
import schemaDirectives from "../graphql/directives"
import { GraphQLError } from "graphql"

const checkError = (error: GraphQLError, errorName: string): boolean => [error.name, error.originalError?.name].some(name => name === errorName)

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
    errors?.forEach(error => {
        response.data = undefined
        if (checkError(error, "UserInputError")) {
            response.http.status = 400
        } else if (checkError(error, "AuthenticationError")) {
            response.http.status = 401
        } else if (checkError(error, "ForbiddenError")) {
            response.http.status = 403
        } else {
            response.http.status = 500
        }
    });
}

export default (app: Express): void => {
    const server = new ApolloServer({
        resolvers,
        typeDefs,
        schemaDirectives,
        context: ({ req }) => ({ req }),
        plugins: [
            {
                requestDidStart: () => ({
                    willSendResponse: ({ response, errors }) => handleErrors(response, errors)
                })
            }
        ]
    })
    server.applyMiddleware({ app })
}