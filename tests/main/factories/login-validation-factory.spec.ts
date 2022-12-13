import { makeLoginValidation } from '@/main/factories/controllers/login/login-validation-factory'
import { Validation } from '@/presentation/protocols'
import { EmailValidator } from '@/validations/protocols'
import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '@/validations/validators'

jest.mock('@/validations/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
