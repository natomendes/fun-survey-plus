export const surveyResultPath = {
  put: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Add survey result API',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
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
              $ref: '#/schemas/saveSurveyResult'
            }
          }
        }
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
