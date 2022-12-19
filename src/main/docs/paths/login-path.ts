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
        $ref: '#components/badRequest'
      },
      401: {
        $ref: '#components/unauthorized'
      },
      404: {
        $ref: '#components/notFound'
      },
      '5XX': {
        $ref: '#components/serverError'
      }
    }
  }
}
