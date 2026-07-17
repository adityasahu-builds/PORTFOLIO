import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export const validate =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];
        const errorMessage = issues.map((err: any) => err.message).join(", ");

        // Don't log sensitive info, but since it's a contact form, body might contain names/emails.
        logger.warn(`Validation failed: ${errorMessage}`, { path: req.path });

        return next(new AppError(errorMessage, 422));
      }
      return next(error);
    }
  };
