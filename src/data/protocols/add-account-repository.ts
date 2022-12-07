import { AddAccountModel } from '../../domain/usecases'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<boolean>
}
