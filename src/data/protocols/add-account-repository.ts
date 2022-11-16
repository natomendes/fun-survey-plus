import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<boolean>
}
