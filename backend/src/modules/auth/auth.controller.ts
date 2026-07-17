import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { LoginInput } from "./auth.validation";
import { ApiResponse } from "../../utils/ApiResponse";
import { config } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { UserResponse } from "./auth.types";
import { User } from "./user.model";

const ACCESS_COOKIE_MAX_AGE = 1 * 60 * 60 * 1000; // 1 hour in ms
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

export class AuthController {
  /**
   * Log in credentials and set secure cookies
   */
  public async login(
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);

      this.setCookies(res, accessToken, refreshToken);

      const response = new ApiResponse(200, "Login successful.", {
        user,
        accessToken, // Included in JSON in case client prefers localStorage
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh session and rotation tokens
   */
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Find refresh token in cookies or body
      const token = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!token) {
        throw new AppError("No session token found. Please log in.", 401);
      }

      const { user, accessToken, refreshToken } = await authService.refresh(token);

      this.setCookies(res, accessToken, refreshToken);

      const response = new ApiResponse(200, "Token refreshed successfully.", {
        user,
        accessToken,
      });

      res.status(200).json(response);
    } catch (error) {
      // If refresh fails, clear invalid cookies so client knows they are logged out
      this.clearCookies(res);
      next(error);
    }
  }

  /**
   * Log out session and revoke refresh token
   */
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is set by authMiddleware
      const userId = (req as any).user?.id;

      if (userId) {
        await authService.logout(userId);
      }

      this.clearCookies(res);

      const response = new ApiResponse(200, "Logout successful.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated user details (Me / Auto-Login)
   */
  public async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AppError("Unauthorized access.", 401);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User profile not found.", 404);
      }

      const formattedUser: UserResponse = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      const response = new ApiResponse(200, "User profile retrieved successfully.", {
        user: formattedUser,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile (username/email)
   */
  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AppError("Unauthorized access.", 401);
      }

      const { username, email } = req.body;
      const updatedUser = await authService.updateProfile(userId, { username, email });

      const response = new ApiResponse(200, "Profile updated successfully.", { user: updatedUser });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   */
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AppError("Unauthorized access.", 401);
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError("Current password and new password are required.", 400);
      }

      if (newPassword.length < 8) {
        throw new AppError("New password must be at least 8 characters.", 400);
      }

      await authService.changePassword(userId, currentPassword, newPassword);

      const response = new ApiResponse(200, "Password changed successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper to set HTTP-only secure cookies
   */
  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = config.nodeEnv === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax", // Lax works for dev, None works cross-site (required if frontend/backend are on different domains in prod)
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  }

  /**
   * Helper to clear HTTP cookies
   */
  private clearCookies(res: Response) {
    const isProduction = config.nodeEnv === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
  }
}

export const authController = new AuthController();
