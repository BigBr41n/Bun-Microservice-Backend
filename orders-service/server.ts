import express, { type ErrorRequestHandler } from "express";
import dotenv from "dotenv";
import {connectDB} from './config/db.connect';
import logger from "./utils/logger";
import globalError from "./utils/globalError";
import unknownRoute from "./utils/unknownRoute";
import { connectAMQP } from "./config/amqp.connect";
import { createOrder } from './src/services/order.services'



dotenv.config();

//express instance
const app = express();

//port
const PORT = process.env.PORT || 3002;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





(async () => {
    let connection, channel;

    // Connecting to AMQP server
    try {
        ({ connection, channel } = await connectAMQP());
        logger.info("Connected to AMQP");
    } catch (error) {
        logger.error("Error connecting to AMQP", error);
        process.exit(1);
    }

    // Consuming messages from the ORDER queue
    try {
        channel.consume("ORDER", async (data) => {
            logger.info("Consuming ORDER service");

            if (!data) {
                logger.error("Received null data");
                return;
            }

            try {
                const { products, userEmail } = JSON.parse(data.content.toString());
                const newOrder = await createOrder(products, userEmail);

                channel.ack(data);
                channel.sendToQueue(
                    "PRODUCT",
                    Buffer.from(JSON.stringify({ newOrder }))
                );
            } catch (err) {
                logger.error("Error processing message", err);
                channel.nack(data, false, false); 
            }
        });
    } catch (error) {
        logger.error("Error consuming ORDER service", error);
        process.exit(1);
    }
})();






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
  



