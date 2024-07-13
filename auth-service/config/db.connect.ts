import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!process.env.DB_URI) {
            reject(new Error("Please add your DB_URI to environment variables to connect to the database"));
            return;
        }

        mongoose.connect(process.env.DB_URI)
            .then(() => {
                console.log("MongoDB connected successfully");
                resolve("Database connection established");
            })
            .catch((error) => {
                console.error("MongoDB connection error:", error);
                reject(error);
            });

        const connection = mongoose.connection;

        connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
            reject(error);
        });

        connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        process.on('SIGINT', async () => {
            try {
                await connection.close();
                console.log('MongoDB connection closed due to app termination');
                process.exit(0);
            } catch (error) {
                console.error('Error during MongoDB disconnection:', error);
                process.exit(1);
            }
        });
    });
};