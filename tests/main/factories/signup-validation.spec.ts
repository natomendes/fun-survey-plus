import { Validation } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers'
import { RequiredFieldValidation, ValidationComposite, EmailValidation, CompareFieldsValidation } from '@/validations/validators'
import { mockEmailValidator } from '@/tests/mocks'

jest.mock('@/validations/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
