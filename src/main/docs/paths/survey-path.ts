export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Load surveys API',
    description: 'This route is only available to authenticated users',
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
    description: 'This route is only available to authenticated admin users',
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
