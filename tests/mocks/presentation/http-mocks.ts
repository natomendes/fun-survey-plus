import { HttpRequest } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'

const password = faker.internet.password()

export const mockSignUpRequest = (): HttpRequest => ({
  body: {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    passwordConfirmation: password
  }
})

export const mockAddSurveyHttpRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{
      image: faker.datatype.string(),
      answer: faker.random.word()
    }],
    date: new Date()
  }
})

export const mockLoginRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

export const mockAuthRequest = (token = faker.datatype.uuid()): HttpRequest => ({
  headers: {
    'x-access-token': token
  }
})
