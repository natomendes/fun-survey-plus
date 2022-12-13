import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validations/validators'
import { faker } from '@faker-js/faker'
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
    const field = faker.database.column()
    const { sut } = makeSut(field)
    const error = sut.validate({ name: '' })
    expect(error).toEqual(new MissingParamError(field))
  })

  it('Should return null if validation succeeds', () => {
    const field = faker.database.column()
    const { sut } = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBe(false)
  })
})
