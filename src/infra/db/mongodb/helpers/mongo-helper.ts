/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MongoClient, Collection } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,

    async connect(_uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect(): Promise<void> {
        await this.client.close()
    },

    getCollection(name: string): Collection {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.client.db().collection(name)
    }
}