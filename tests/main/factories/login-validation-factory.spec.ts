import { Validation } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/controllers'
import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '@/validations/validators'
import { mockEmailValidator } from '@/tests/mocks'

jest.mock('@/validations/validators/validation-composite')

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
