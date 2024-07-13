import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import logger from "../utils/logger";
import {ApiError} from "./ApiError";


const globalError: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (process.env.NODE_ENV !== "production") {
    res.status(err.status || 500).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }

  logger.error(err);
};

export default globalError;
