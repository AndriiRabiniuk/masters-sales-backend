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
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and user management endpoints',
      },
      {
        name: 'Companies',
        description: 'Company management endpoints',
      },
      {
        name: 'Clients',
        description: 'Client management endpoints',
      },
      {
        name: 'Contacts',
        description: 'Contact management endpoints',
      },
      {
        name: 'Leads',
        description: 'Lead management endpoints',
      },
      {
        name: 'Notes',
        description: 'Note management endpoints',
      },
      {
        name: 'Interactions',
        description: 'Interaction management endpoints',
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints',
      },
      {
        name: 'Upload',
        description: 'File upload and AWS S3 related endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};
const cmsSwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS API',
      version: '1.0.0',
      description: 'API documentation for the CMS application',
    },
  },
  apis: ['./src/routes/cms/*.js'], // Path to the CMS routes files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const cmsSwaggerDocs = swaggerJsDoc(cmsSwaggerOptions);

module.exports = { swaggerDocs, cmsSwaggerDocs }; 