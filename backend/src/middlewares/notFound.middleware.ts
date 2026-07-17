import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};
