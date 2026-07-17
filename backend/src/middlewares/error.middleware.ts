import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error handling (for future)
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }

  // Log error
  if (!isOperational || statusCode >= 500) {
    logger.error("Unhandled Error", { error: err.stack, path: req.path, method: req.method });
  } else {
    logger.warn(`Operational Error: ${message}`, { path: req.path });
  }

  const response = new ApiResponse(statusCode, message);

  // Send response
  res.status(statusCode).json({
    ...response,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });
};
