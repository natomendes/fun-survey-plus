import { AddAccountParams } from '@/domain/usecases'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<boolean>
}
