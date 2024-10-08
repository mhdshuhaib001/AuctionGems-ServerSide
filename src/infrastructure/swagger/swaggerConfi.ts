import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
console.log(port,'suiiiiii')
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API documentation for my application',
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/adaptors/AuthController/authController*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};
