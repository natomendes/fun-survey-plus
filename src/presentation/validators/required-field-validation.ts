import { MissingParamError } from '../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: object): Error {
    return input[this.fieldName] ? null : new MissingParamError(this.fieldName)
  }
}
