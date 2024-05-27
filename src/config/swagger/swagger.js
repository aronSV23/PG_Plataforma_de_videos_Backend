import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'PG_Plataforma_de_videos',
    description: 'Proyecto de clases Plataforma de Gestión y Streaming de Videos'
  },
  host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['src/app.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc)
