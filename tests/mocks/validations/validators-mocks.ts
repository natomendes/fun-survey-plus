import { Validation } from '@/presentation/protocols'
import { EmailValidator } from '@/validations/protocols'

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (_input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
