import {logger} from './logger';
import axios from 'axios';

// Combine Swagger docs from microservices
export async function combineSwaggerDocs() {
  try {
    // Fetch Swagger docs from microservices
    const authDocs = await axios.get(`http://localhost:${process.env.AUTH_PORT}/swagger.json`);
    const productDocs = await axios.get(`http://localhost:${process.env.PRODUCT_PORT}/swagger.json`);
    const orderDocs = await axios.get(`http://localhost:${process.env.ORDER_PORT}/swagger.json`);

    // Combine docs (simple merge example, adjust as needed)
    const combinedDocs = {
      openapi: '3.0.0',
      info: {
        title: 'Combined API Documentation',
        version: '1.0.0',
      },
      paths: {
        ...authDocs.data.paths,
        ...productDocs.data.paths,
        ...orderDocs.data.paths,
      },
      components: {
        ...authDocs.data.components,
        ...productDocs.data.components,
        ...orderDocs.data.components,
      },
      // Add more merge logic if needed
    };

    return combinedDocs;
  } catch (error) {
    logger.error('Error fetching Swagger docs:', error);
    throw new Error('Unable to combine Swagger docs');
  }
}

