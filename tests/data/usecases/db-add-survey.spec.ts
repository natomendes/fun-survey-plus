import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/usecases-protocols'

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (_surveyData: AddSurveyModel): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: faker.random.words(),
  answers: [{
    image: faker.datatype.string(),
    answer: faker.datatype.string()
  }],
  date: new Date()
})

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeAddSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  it('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAddSurveyData())
    await expect(promise).rejects.toThrow(new Error())
  })
})
