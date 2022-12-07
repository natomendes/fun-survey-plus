import { Collection, MongoClient } from 'mongodb'

interface IMongoHelper {
  client: MongoClient | null

  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  // map: <T>(data: any) => T
}

export const MongoHelper: IMongoHelper = {
  client: null,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
  // map<T> (data: any): T {
  //   const { _id, ...rest } = data
  //   return { ...rest, id: _id.toHexString() }
  // }
}
