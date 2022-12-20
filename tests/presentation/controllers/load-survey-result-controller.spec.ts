import { HttpRequest, LoadSurveyById } from '@/presentation/controllers/controllers-protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { forbidden, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'
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

  it('Should return forbidden if LoadSurveyById returns null', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return server error if LoadSurveyById throws', async () => {
    const { sut, loadSurverByIdStub } = makeSut()
    jest.spyOn(loadSurverByIdStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })
})
