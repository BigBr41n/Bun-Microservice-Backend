import mongoose from "mongoose";
import dotenv from 'dotenv';
import logger from "../utils/logger";

dotenv.config();

export const connectDB = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!process.env.DB_URI) {
            reject(new Error("Please add your DB_URI to environment variables to connect to the database"));
            return;
        }

        mongoose.connect(process.env.DB_URI)
            .then(() => {
                logger.info("MongoDB connected successfully");
                resolve("Database connection established");
            })
            .catch((error) => {
                logger.error("MongoDB connection error:", error);
                reject(error);
            });

        const connection = mongoose.connection;

        connection.on("error", (error) => {
            logger.error("MongoDB connection error:", error);
            reject(error);
        });

        connection.on("disconnected", () => {
            logger.info("MongoDB disconnected");
        });

        process.on('SIGINT', async () => {
            try {
                await connection.close();
                logger.info('MongoDB connection closed due to app termination');
                process.exit(0);
            } catch (error) {
                logger.error('Error during MongoDB disconnection:', error);
                process.exit(1);
            }
        });
    });
};