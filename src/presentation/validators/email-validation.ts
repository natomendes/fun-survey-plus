import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator, Validation } from '@/presentation/protocols'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: object): Error {
    return this.emailValidator.isValid(input[this.fieldName])
      ? null
      : new InvalidParamError(this.fieldName)
  }
}
