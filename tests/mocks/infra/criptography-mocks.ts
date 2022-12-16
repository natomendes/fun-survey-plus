import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols'

export const mockHasher = (hashedPassword: string): Hasher => {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return hashedPassword
    }
  }
  return new HasherStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

export const mockEncrypter = (token: string): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (_userId: string): Promise<string> {
      return token
    }
  }
  return new EncrypterStub()
}

export const mockDecrypter = (decryptedToken: string): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_token: string): Promise<string> {
      return decryptedToken
    }
  }
  return new DecrypterStub()
}
