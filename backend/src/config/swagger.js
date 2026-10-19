const path = require('node:path')
const swaggerJsdoc = require('swagger-jsdoc')

const source = path.resolve(__dirname, '..').replace(/\\/g, '/')

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API IFRS Voluntariado',
      version: '1.0.0',
      description: 'API para gerenciamento de voluntários, eventos e inscrições.',
    },
    servers: [
      {
        url: '/',
        description: 'Servidor da aplicação',
      },
    ],
    tags: [
      { name: 'Autenticação', description: 'Login e acesso ao sistema' },
      { name: 'Dashboard', description: 'Informações do usuário autenticado' },
      { name: 'Usuários', description: 'Gerenciamento de usuários e voluntários' },
      { name: 'Eventos', description: 'Gerenciamento de eventos sociais' },
      { name: 'Inscrições', description: 'Inscrições de voluntários em eventos' },
    ],
  },
  apis: [`${source}/routes/*.js`, `${source}/docs/*.js`],
}

module.exports = swaggerJsdoc(options)
