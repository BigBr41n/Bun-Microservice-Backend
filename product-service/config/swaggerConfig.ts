import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Auth Service API Documentation',
    },
  },
  apis: ['./src/routes.ts', './src/v1/models/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;