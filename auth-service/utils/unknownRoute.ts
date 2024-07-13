import type { Request , Response , NextFunction } from "express";


const unknownRoute = (req: Request, res: Response , next: NextFunction) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));    
}

export default unknownRoute;