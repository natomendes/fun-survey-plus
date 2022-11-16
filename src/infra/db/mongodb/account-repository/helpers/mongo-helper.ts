import { MongoClient } from 'mongodb'

interface IMongoHelper {
  client: MongoClient | null
  connect: (url: string) => Promise<void>
  disconnect: () => Promise<void>
}

export const MongoHelper: IMongoHelper = {
  client: null,
  async connect (url: string) {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string)
  },

  async disconnect () {
    await this.client.close()
  }
}
