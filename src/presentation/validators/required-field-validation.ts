import { MissingParamError } from '../errors'
import { Validation } from '../protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: object): Error {
    return !input[this.fieldName] && new MissingParamError(this.fieldName)
  }
}
