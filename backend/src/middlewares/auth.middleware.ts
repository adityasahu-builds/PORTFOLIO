import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AppError } from "../errors/AppError";
import { TokenPayload } from "../modules/auth/auth.types";
import { User } from "../modules/auth/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = "";

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2. Fallback to cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AppError("Access denied. No session token provided.", 401);
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

      const user = await User.findById(decoded.id);
      if (!user || !user.refreshToken) {
        throw new AppError("Invalid or expired session. Please log in again.", 401);
      }

      (req as any).user = decoded;
      next();
    } catch (jwtError: any) {
      if (jwtError.name === "TokenExpiredError") {
        throw new AppError("Access token expired. Please refresh session.", 401);
      }
      if (jwtError instanceof AppError) {
        throw jwtError;
      }
      throw new AppError("Invalid access token. Please log in again.", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as TokenPayload;
      if (!user) {
        throw new AppError("Authentication required.", 401);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError("Access denied. Insufficient privileges.", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
