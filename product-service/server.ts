import express, { type ErrorRequestHandler , type Request , type Response } from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.connect';
import logger from "./utils/logger";
import globalError from "./utils/globalError";
import unknownRoute from "./utils/unknownRoute";
import productRoutes from './src/routes';
import swaggerSpec from "./config/swaggerConfig";
import swaggerUi from 'swagger-ui-express';

dotenv.config();

//express instance
const app = express();

//port
const PORT = process.env.PORT || 3002;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
app.use("/v1", productRoutes);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req : Request, res : Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

//unknown route 
app.use(unknownRoute)

//global error
app.use(globalError as ErrorRequestHandler);


(async () => {
    try {
      await connectDB(); 
  
      const server = app.listen(PORT, () => {
        logger.info(`Products Server is running on http://localhost:${PORT}`);
      });

      server.keepAliveTimeout = 3000; 
  
      process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(() => {
          logger.info('HTTP server closed');
          process.exit(0);
        });
      });
  
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
})()
  



