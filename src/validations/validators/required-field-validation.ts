import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: object): Error {
    return !input[this.fieldName] && new MissingParamError(this.fieldName)
  }
}
