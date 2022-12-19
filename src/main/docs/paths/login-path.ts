export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'User authentication API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      },
      400: {
        description: 'Bad request, invalid email or password'
      },
      401: {
        description: 'Unauthorized, invalid credentials'
      },
      '5XX': {
        description: 'Server error, internal server error'
      }
    }
  }
}
