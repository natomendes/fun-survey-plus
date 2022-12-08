import { InvalidParamError } from '../../../src/presentation/errors'
import { CompareFieldsValidation } from '../../../src/presentation/validators'
import { faker } from '@faker-js/faker'
interface SutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (fieldName = faker.database.column(), fieldToCompareName = faker.database.column()): SutTypes => {
  const sut = new CompareFieldsValidation(fieldName, fieldToCompareName)
  return {
    sut
  }
}

describe('Required Field Validation', () => {
  it('Should return InvalidParamError if comparison fails', () => {
    const field = faker.database.column()
    const fieldToCompareName = faker.database.column()
    const { sut } = makeSut(field, fieldToCompareName)
    const error = sut.validate({ [field]: '123', [fieldToCompareName]: '12' })
    expect(error).toEqual(new InvalidParamError(fieldToCompareName))
  })
})
