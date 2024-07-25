import winston from "winston";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import fs from "fs";
import { dirname } from "path";
import "winston-daily-rotate-file";

dotenv.config();

const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const customFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      handleExceptions: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Prevent exit on handled exceptions
});


export default logger;
