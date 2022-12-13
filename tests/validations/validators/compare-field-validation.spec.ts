import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validations/validators'
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

describe('Compare Field Validation', () => {
  it('Should return InvalidParamError if comparison fails', () => {
    const field = faker.random.word()
    const fieldToCompareName = faker.database.column()
    const { sut } = makeSut(field, fieldToCompareName)
    const error = sut.validate({ [field]: '123', [fieldToCompareName]: '12' })
    expect(error).toEqual(new InvalidParamError(fieldToCompareName))
  })

  it('Should return false if validation succeeds', () => {
    const field = faker.database.column()
    const fieldToCompareName = faker.database.column()
    const { sut } = makeSut(field, fieldToCompareName)
    const error = sut.validate({ [field]: '123', [fieldToCompareName]: '123' })
    expect(error).toBe(false)
  })
})
