import winston from "winston";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import {dirname} from 'path';
dotenv.config();

const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const customFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Create a logger
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }), // Capture stack traces for errors
    winston.format.colorize(), // Colorize the logs
    customFormat // Apply custom format
  ),

  transports: [
    new winston.transports.Console({
      handleExceptions: true, // Handle exceptions
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs", "error.log"),
      level: "error",
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs", "combined.log"),
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Prevent exit on handled exceptions
});

export { logger };
