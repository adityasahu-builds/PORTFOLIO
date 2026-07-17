import jwt from "jsonwebtoken";
import { User, IUser } from "./user.model";
import { LoginInput } from "./auth.validation";
import { TokenPayload, UserResponse } from "./auth.types";
import { config } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class AuthService {
  /**
   * Login user and generate tokens
   */
  public async login(input: LoginInput): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  }> {
    const { usernameOrEmail, password } = input;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail.toLowerCase() }, { email: usernameOrEmail.toLowerCase() }],
    });

    if (!user) {
      throw new AppError("Invalid username/email or password", 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid username/email or password", 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    logger.info(`User ${user.username} logged in successfully.`);

    return {
      user: this.formatUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify refresh token and generate new tokens
   */
  public async refresh(token: string): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const payload = jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;

      // Find user and check if token matches
      const user = await User.findById(payload.id);
      if (!user || user.refreshToken !== token) {
        throw new AppError("Invalid or expired session. Please log in again.", 401);
      }

      // Generate new tokens
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Save new refresh token
      user.refreshToken = refreshToken;
      await user.save();

      logger.info(`Token refreshed for user ${user.username}.`);

      return {
        user: this.formatUser(user),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Invalid or expired session. Please log in again.", 401);
    }
  }

  /**
   * Logout user and revoke refresh token
   */
  public async logout(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
      logger.info(`User ${user.username} logged out.`);
    }
  }

  /**
   * Update user profile (username / email)
   */
  public async updateProfile(
    userId: string,
    data: { username?: string; email?: string }
  ): Promise<UserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (data.username && data.username.toLowerCase() !== user.username) {
      const existing = await User.findOne({
        username: data.username.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existing) {
        throw new AppError("Username is already taken.", 400);
      }
      user.username = data.username.toLowerCase();
    }

    if (data.email && data.email.toLowerCase() !== user.email) {
      const existing = await User.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existing) {
        throw new AppError("Email is already in use.", 400);
      }
      user.email = data.email.toLowerCase();
    }

    await user.save();
    logger.info(`Profile updated for user ${user.username}.`);

    return this.formatUser(user);
  }

  /**
   * Change user password
   */
  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError("Current password is incorrect.", 401);
    }

    user.password = newPassword;
    await user.save();
    logger.info(`Password changed for user ${user.username}.`);
  }

  /**
   * Helper to sign access and refresh tokens
   */
  private generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      id: user._id.toString(),
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn as any,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Helper to format user response
   */
  private formatUser(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
