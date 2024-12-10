const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Service Name API Documentation',
    version: '1.0.0',
    description: 'Documentation for the service-specific API',
  },
  servers: [
    {
      url: process.env.SNL_URL_SWAGGER,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.get('/api/swagger.json', (req, res) => {
    res.json(swaggerSpec);
  });
};
