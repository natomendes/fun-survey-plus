import { Collection, MongoClient } from 'mongodb'

interface IMongoHelper {
  client: MongoClient | null
  connect: (url: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  map: <T>(data: any) => T
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
  },

  map<T> (data: any): T {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  }
}
