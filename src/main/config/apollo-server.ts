import { ApolloServer } from "apollo-server-express"
import { Express } from "express"

import typeDefs from "../graphql/type-defs"
import resolvers from "../graphql/resolvers"

export default (app: Express): void => {
    const server = new ApolloServer({
        resolvers,
        typeDefs
    })
    server.applyMiddleware({ app })
}