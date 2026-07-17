import crypto from "crypto";
import { VisitorSession, AnalyticsEvent } from "./analytics.model";
import { Project } from "../project/project.model";
import { Skill } from "../skill/skill.model";
import { Experience } from "../experience/experience.model";
import { Education } from "../education/education.model";
import { Certificate } from "../certificate/certificate.model";
import { Contact } from "../contact/contact.model";

export class AnalyticsService {
  /**
   * Tracks a visitor event.
   * Creates a session if one doesn't exist, updates duration, and saves the event.
   */
  async trackEvent(data: {
    sessionId: string;
    ip?: string;
    country?: string;
    city?: string;
    deviceType?: "Desktop" | "Mobile" | "Tablet" | "Unknown";
    browser?: string;
    os?: string;
    screenSize?: string;
    referralSource?: string;
    landingPage?: string;
    eventName:
      | "pageView"
      | "projectView"
      | "resumeDownload"
      | "contactSubmission"
      | "socialClick"
      | "ctaClick";
    pagePath?: string;
    details?: Record<string, any>;
  }) {
    const {
      sessionId,
      ip = "",
      country = "Unknown",
      city = "Unknown",
      deviceType = "Unknown",
      browser = "Unknown",
      os = "Unknown",
      screenSize = "Unknown",
      referralSource = "Direct",
      landingPage = "/",
      eventName,
      pagePath = "/",
      details = {},
    } = data;

    // Hash IP for privacy compliance
    const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : "";

    const now = new Date();

    // Check if session exists
    let session = await VisitorSession.findOne({ sessionId });

    if (!session) {
      // Create new session
      session = await VisitorSession.create({
        sessionId,
        ipHash,
        country: country || "Unknown",
        city: city || "Unknown",
        deviceType,
        browser,
        os,
        screenSize,
        referralSource: referralSource || "Direct",
        landingPage,
        visitTime: now,
        lastActiveTime: now,
        sessionDuration: 0,
      });
    } else {
      // Update existing session activity
      const durationSeconds = Math.round((now.getTime() - session.visitTime.getTime()) / 1000);
      session.lastActiveTime = now;
      session.sessionDuration = durationSeconds;
      await session.save();
    }

    // Save analytics event record
    const event = await AnalyticsEvent.create({
      sessionId,
      eventName,
      pagePath,
      details,
      timestamp: now,
    });

    return { session, event };
  }

  /**
   * Resolves statistics for the overview dashboard.
   */
  async getDashboardStats(startDate: Date, endDate: Date) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 7 days ago
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 30 days ago
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Run parallel counts for performance
    const [
      visitorsToday,
      visitorsThisWeek,
      visitorsThisMonth,
      totalViews,
      uniqueVisitors,
      projectsCount,
      skillsCount,
      experienceCount,
      educationCount,
      certificatesCount,
      messagesCount,
    ] = await Promise.all([
      // Visitors Today
      VisitorSession.countDocuments({ visitTime: { $gte: startOfToday } }),
      // Visitors This Week
      VisitorSession.countDocuments({ visitTime: { $gte: startOfWeek } }),
      // Visitors This Month
      VisitorSession.countDocuments({ visitTime: { $gte: startOfMonth } }),
      // Total Views (in range)
      AnalyticsEvent.countDocuments({
        eventName: "pageView",
        timestamp: { $gte: startDate, $lte: endDate },
      }),
      // Unique Visitors (in range)
      VisitorSession.countDocuments({ visitTime: { $gte: startDate, $lte: endDate } }),
      // DB Entity Counts
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
    ]);

    return {
      visitorsToday,
      visitorsThisWeek,
      visitorsThisMonth,
      totalViews,
      uniqueVisitors,
      projects: projectsCount,
      skills: skillsCount,
      experience: experienceCount,
      education: educationCount,
      certificates: certificatesCount,
      messages: messagesCount,
    };
  }

  /**
   * Retrieves paginated visitor sessions within a date range.
   */
  async getVisitors(startDate: Date, endDate: Date, limit = 20, page = 1) {
    const skip = (page - 1) * limit;

    const [visitors, total] = await Promise.all([
      VisitorSession.find({ visitTime: { $gte: startDate, $lte: endDate } })
        .sort({ visitTime: -1 })
        .skip(skip)
        .limit(limit),
      VisitorSession.countDocuments({ visitTime: { $gte: startDate, $lte: endDate } }),
    ]);

    return {
      visitors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Aggregates visitor counts and traffic trends.
   */
  async getTrafficTrends(startDate: Date, endDate: Date) {
    // 1. Group daily visitor sessions
    const trends = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitTime" } },
          visitors: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // 2. Browser distribution
    const browsers = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 3. Device distribution
    const devices = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 4. Country distribution
    const countries = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 5. Referral sources
    const referrals = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$referralSource",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      trends: trends.map((t) => ({ date: t._id, visitors: t.visitors })),
      browsers: browsers.map((b) => ({ name: b._id, count: b.count })),
      devices: devices.map((d) => ({ name: d._id, count: d.count })),
      countries: countries.map((c) => ({ name: c._id, count: c.count })),
      referrals: referrals.map((r) => ({ name: r._id, count: r.count })),
    };
  }

  /**
   * Aggregates content-specific interaction metrics (page views, project views, downloads).
   */
  async getContentStats(startDate: Date, endDate: Date) {
    // 1. Top Pages PageViews
    const topPages = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventName: "pageView",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$pagePath",
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    // 2. Project Views
    const projectViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventName: "projectView",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$details.projectSlug",
          title: { $first: "$details.projectTitle" },
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    // 3. Social clicks
    const socialClicks = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventName: "socialClick",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$details.socialPlatform",
          clicks: { $sum: 1 },
        },
      },
      { $sort: { clicks: -1 } },
    ]);

    // 4. CTA Button Clicks
    const ctaClicks = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventName: "ctaClick",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$details.ctaLabel",
          clicks: { $sum: 1 },
        },
      },
      { $sort: { clicks: -1 } },
    ]);

    // 5. Resume downloads count
    const resumeDownloads = await AnalyticsEvent.countDocuments({
      eventName: "resumeDownload",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    return {
      topPages: topPages.map((tp) => ({ path: tp._id, views: tp.views })),
      projectViews: projectViews.map((pv) => ({
        slug: pv._id,
        title: pv.title || pv._id,
        views: pv.views,
      })),
      socialClicks: socialClicks.map((sc) => ({ platform: sc._id, clicks: sc.clicks })),
      ctaClicks: ctaClicks.map((cc) => ({ label: cc._id, clicks: cc.clicks })),
      resumeDownloads,
    };
  }

  /**
   * Retrieves message trends and details.
   */
  async getMessageStats(startDate: Date, endDate: Date) {
    // 1. Message trend over time
    const trends = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Recent Messages
    const recent = await Contact.find({ createdAt: { $gte: startDate, $lte: endDate } })
      .sort({ createdAt: -1 })
      .limit(10);

    // 3. Most Active Traffic Days
    const activeDays = await VisitorSession.aggregate([
      {
        $match: {
          visitTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$visitTime" },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { visitors: -1 } },
    ]);

    const dayNameMap: Record<number, string> = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    return {
      trends: trends.map((t) => ({ date: t._id, count: t.count })),
      recent,
      activeDays: activeDays.map((ad) => ({
        day: dayNameMap[ad._id] || "Unknown",
        visitors: ad.visitors,
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
