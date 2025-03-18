const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales CRM API',
      version: '1.0.0',
      description: 'API documentation for the Sales CRM application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs; 