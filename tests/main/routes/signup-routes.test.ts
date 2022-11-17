import request from 'supertest'
import app from '../../../src/main/config/app'

describe('SignUp Routes', () => {
  it('Should return Ok on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
