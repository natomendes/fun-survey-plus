import { MissingParamError } from '../../../src/presentation/errors'
import { RequiredFieldValidation } from '../../../src/presentation/validators'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (fieldName: string): SutTypes => {
  const sut = new RequiredFieldValidation(fieldName)
  return {
    sut
  }
}

describe('Required Field Validation', () => {
  it('Should return MissingParamError if validation fails', () => {
    const { sut } = makeSut('any_field')
    const error = sut.validate({ any_field: '' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })
})
