import { makeSignUpValidation } from '../../../src/main/factories/signup-validation'
import { Validation } from '../../../src/presentation/validators'
import { RequiredFieldValidation } from '../../../src/presentation/validators/required-field-validation'
import { ValidationComposite } from '../../../src/presentation/validators/validation-composite'

jest.mock('../../../src/presentation/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
