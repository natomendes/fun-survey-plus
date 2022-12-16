import { LogErrorRepository } from '@/data/protocols'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> { }
  }
  return new LogErrorRepositoryStub()
}
