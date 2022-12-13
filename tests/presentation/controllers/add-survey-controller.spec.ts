import { faker } from '@faker-js/faker'
import { HttpRequest, Validation } from '@/presentation/controllers/add-survey/add-survey-protocols'
import { AddSurveyController } from '@/presentation/controllers/add-survey/add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{
      image: faker.datatype.string(),
      answer: faker.random.word()
    }]
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (_input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
