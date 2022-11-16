import { Collection, MongoClient } from 'mongodb'

interface IMongoHelper {
  client: MongoClient | null
  connect: (url: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
}

export const MongoHelper: IMongoHelper = {
  client: null,
  async connect (url: string) {
    this.client = await MongoClient.connect(url)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
