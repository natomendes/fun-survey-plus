import { serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/protocols'

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
