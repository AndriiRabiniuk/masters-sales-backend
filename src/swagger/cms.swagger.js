const swaggerJsdoc = require('swagger-jsdoc');

// Define CMS swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS API Documentation',
      version: '1.0.0',
      description: 'API documentation for Content Management System (CMS)',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001/api/cms',
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
  // Include all CMS routes files
  apis: [
    './src/routes/cms/*.js' // This will include all files in the cms directory
  ]
};

const specs = swaggerJsdoc(options);

// Post-process to only include CMS routes
if (specs.paths) {
  const filteredPaths = {};
  Object.keys(specs.paths).forEach(path => {
    // Only include paths that contain /api/cms
    if (path.includes('/api/cms')) {
      filteredPaths[path] = specs.paths[path];
    }
  });
  specs.paths = filteredPaths;
}

module.exports = specs; 