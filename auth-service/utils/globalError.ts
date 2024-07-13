import type { Request, Response, NextFunction } from "express";
import logger from '../utils/logger';


const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if(err instanceof ApiError)
        res.status(err.statusCode).json(err.message);

    else if (process.env.NODE_ENV !== 'production')
        res.status(err.status).json(err.message);

    else 
        res.status(500).json('INternal Server Error!');

    logger.error(err.stack);
};

export default globalError;