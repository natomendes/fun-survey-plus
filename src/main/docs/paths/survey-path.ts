export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Load surveys API',
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      404: {
        $ref: '#components/notFound'
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
