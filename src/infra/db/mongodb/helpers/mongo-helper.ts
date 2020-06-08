/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MongoClient } from "mongodb"

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
    }
}