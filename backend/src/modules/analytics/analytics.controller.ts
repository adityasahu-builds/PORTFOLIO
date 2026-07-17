import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  private parseDateRange(range?: string, customStart?: string, customEnd?: string) {
    const now = new Date();
    let startDate = new Date();
    let endDate = now;

    switch (range) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        if (customStart) startDate = new Date(customStart);
        if (customEnd) endDate = new Date(customEnd);
        break;
      default:
        // Default to last 30 days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    return { startDate, endDate };
  }

  private parseUserAgent(uaString: string) {
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";

    const ua = uaString.toLowerCase();

    // Browser check
    if (ua.includes("firefox")) {
      browser = "Firefox";
    } else if (ua.includes("opera") || ua.includes("opr")) {
      browser = "Opera";
    } else if (ua.includes("edge") || ua.includes("edg")) {
      browser = "Edge";
    } else if (ua.includes("chrome")) {
      browser = "Chrome";
    } else if (ua.includes("safari")) {
      browser = "Safari";
    } else if (ua.includes("trident") || ua.includes("msie")) {
      browser = "Internet Explorer";
    }

    // OS check
    if (ua.includes("windows")) {
      os = "Windows";
    } else if (ua.includes("macintosh") || ua.includes("mac os")) {
      os = "MacOS";
    } else if (ua.includes("linux")) {
      os = "Linux";
    } else if (ua.includes("android")) {
      os = "Android";
    } else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
      os = "iOS";
    }

    // Device check
    if (
      ua.includes("tablet") ||
      ua.includes("ipad") ||
      (ua.includes("android") && !ua.includes("mobile"))
    ) {
      deviceType = "Tablet";
    } else if (
      ua.includes("mobile") ||
      ua.includes("iphone") ||
      ua.includes("ipod") ||
      ua.includes("blackberry")
    ) {
      deviceType = "Mobile";
    } else if (
      ua.includes("macintosh") ||
      ua.includes("windows") ||
      (ua.includes("linux") && !ua.includes("android"))
    ) {
      deviceType = "Desktop";
    }

    return { browser, os, deviceType };
  }

  /**
   * Public POST endpoint to ingest tracking events.
   */
  async track(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        sessionId,
        eventName,
        pagePath,
        details,
        screenSize,
        referralSource,
        landingPage,
        country,
        city,
      } = req.body;

      if (!sessionId || !eventName) {
        return res.status(400).json({
          success: false,
          message: "Session ID and Event Name are required tracking fields.",
        });
      }

      // Extract client IP
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")?.[0]?.trim() ||
        req.socket.remoteAddress ||
        "";

      // Parse user agent
      const userAgentStr = req.headers["user-agent"] || "";
      const { browser, os, deviceType } = this.parseUserAgent(userAgentStr);

      const result = await analyticsService.trackEvent({
        sessionId,
        ip,
        country,
        city,
        deviceType,
        browser,
        os,
        screenSize,
        referralSource,
        landingPage,
        eventName,
        pagePath,
        details,
      });

      return res.status(200).json({
        success: true,
        message: "Event tracked successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected GET endpoint for dashboard summary metrics.
   */
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { range, startDate: customStart, endDate: customEnd } = req.query;
      const { startDate, endDate } = this.parseDateRange(
        range as string,
        customStart as string,
        customEnd as string
      );

      const stats = await analyticsService.getDashboardStats(startDate, endDate);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected GET endpoint for visitor lists.
   */
  async getVisitors(req: Request, res: Response, next: NextFunction) {
    try {
      const { range, startDate: customStart, endDate: customEnd, page, limit } = req.query;
      const { startDate, endDate } = this.parseDateRange(
        range as string,
        customStart as string,
        customEnd as string
      );

      const limitNum = limit ? parseInt(limit as string) : 20;
      const pageNum = page ? parseInt(page as string) : 1;

      const stats = await analyticsService.getVisitors(startDate, endDate, limitNum, pageNum);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected GET endpoint for traffic metrics and device trend charts.
   */
  async getTraffic(req: Request, res: Response, next: NextFunction) {
    try {
      const { range, startDate: customStart, endDate: customEnd } = req.query;
      const { startDate, endDate } = this.parseDateRange(
        range as string,
        customStart as string,
        customEnd as string
      );

      const traffic = await analyticsService.getTrafficTrends(startDate, endDate);

      return res.status(200).json({
        success: true,
        data: traffic,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected GET endpoint for content interaction metrics.
   */
  async getContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { range, startDate: customStart, endDate: customEnd } = req.query;
      const { startDate, endDate } = this.parseDateRange(
        range as string,
        customStart as string,
        customEnd as string
      );

      const content = await analyticsService.getContentStats(startDate, endDate);

      return res.status(200).json({
        success: true,
        data: content,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected GET endpoint for recent contact message counts & trends.
   */
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { range, startDate: customStart, endDate: customEnd } = req.query;
      const { startDate, endDate } = this.parseDateRange(
        range as string,
        customStart as string,
        customEnd as string
      );

      const messages = await analyticsService.getMessageStats(startDate, endDate);

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
