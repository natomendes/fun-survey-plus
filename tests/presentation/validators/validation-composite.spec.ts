import { MissingParamError } from '../../../src/presentation/errors'
import { Validation, ValidationComposite } from '../../../src/presentation/validators'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('first_field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('second_field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('first_field'))
  })

  it('Should return falsy if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
