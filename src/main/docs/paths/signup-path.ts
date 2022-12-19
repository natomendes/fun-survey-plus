export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'User authentication API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
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
      404: {
        $ref: '#components/notFound'
      },
      400: {
        $ref: '#components/badRequest'
      },
      403: {
        $ref: '#components/forbidden'
      },
      '5XX': {
        $ref: '#components/serverError'
      }
    }
  }
}
