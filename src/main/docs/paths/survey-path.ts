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
  },
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Add survey API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Successful operation'
      },
      400: {
        $ref: '#components/badRequest'
      },
      403: {
        $ref: '#components/forbidden'
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
