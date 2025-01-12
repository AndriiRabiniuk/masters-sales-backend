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
      {
        name: 'Public Users',
        description: 'Public user registration endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/public/*.js'], // Path to the API routes files
};

const cmsSwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS API Documentation',
      version: '1.0.0',
      description: 'API documentation for Content Management System (CMS)',
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`,
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
    security: [{
      bearerAuth: [],
    }],
    tags: [
      {
        name: 'Content',
        description: 'Content management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Tags',
        description: 'Tag management endpoints',
      },
      {
        name: 'Templates',
        description: 'Template management endpoints',
      },
    ],
  },
  apis: ['./src/routes/cms/*.js'], // Path to the CMS routes files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const cmsSwaggerDocs = swaggerJsDoc(cmsSwaggerOptions);

// Post-process to only include CMS routes for the CMS Swagger docs
if (cmsSwaggerDocs.paths) {
  const filteredPaths = {};
  Object.keys(cmsSwaggerDocs.paths).forEach(path => {
    // Only include paths that contain /api/cms
    if (path.includes('/api/cms')) {
      filteredPaths[path] = cmsSwaggerDocs.paths[path];
    }
  });
  cmsSwaggerDocs.paths = filteredPaths;
}

module.exports = { swaggerDocs, cmsSwaggerDocs }; 