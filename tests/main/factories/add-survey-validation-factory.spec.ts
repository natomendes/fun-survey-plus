import { Validation } from '@/presentation/protocols'
import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { RequiredFieldValidation, ValidationComposite } from '@/validations/validators'

jest.mock('@/validations/validators/validation-composite')

describe('AddSurvey Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
