import type { NextFunction ,Request ,Response } from "express";
import { verifyJwt } from "../../../utils/jwt.utils";



export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const result = verifyJwt(token);
            if(result.valid) {
                next();
            }
            else throw new Error("unauthenticated , please login first");
        } catch (error : any) {
            next(new ApiError(error.message, 401));
        }
    } else {
        next(new ApiError("No token provided", 401));
    }
}