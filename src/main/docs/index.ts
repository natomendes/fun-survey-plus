import paths from '@/main/docs/paths'
import schemas from '@/main/docs/schemas'
import components from '@/main/docs/components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Fun Survey Plus',
    description: 'Fun Survey PLus, Node API using TDD, Clean Architecture and Typescript',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
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
