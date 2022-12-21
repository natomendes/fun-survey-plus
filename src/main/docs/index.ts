import paths from '@/main/docs/paths'
import schemas from '@/main/docs/schemas'
import components from '@/main/docs/components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Fun Survey Plus',
    description: 'Fun Survey PLus is an open source Node API using TDD, Clean Architecture and Typescript',
    version: '1.1.0',
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    },
    contact: {
      name: 'Renato Mendes (Author)',
      url: 'https://www.linkedin.com/in/renatolmendes/'
    }
  },
  externalDocs: {
    description: 'Visit the project repository.',
    url: 'https://github.com/natomendes/fun-survey-plus'
  },
  servers: [{
    url: 'https://surveyapi.up.railway.app/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Survey'
  }],
  paths,
  schemas,
  components
}
