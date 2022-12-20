import { HttpRequest, LoadSurveyById } from '@/presentation/controllers/controllers-protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { mockLoadSurverById } from '@/tests/mocks'
import { faker } from '@faker-js/faker'

const surveyId = faker.database.mongodbObjectId()

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurverByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurverByIdStub = mockLoadSurverById()
  const sut = new LoadSurveyResultController(loadSurverByIdStub)
  return {
    sut,
    loadSurverByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurverByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith(surveyId)
  })
})
