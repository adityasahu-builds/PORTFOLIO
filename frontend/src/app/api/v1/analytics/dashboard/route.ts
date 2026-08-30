import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import {
  VisitorSession,
  AnalyticsEvent,
  Project,
  Skill,
  Experience,
  Education,
  Certificate,
  Contact,
} from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      visitorsToday,
      visitorsThisWeek,
      visitorsThisMonth,
      uniqueVisitors,
      totalViews,
      projects,
      skills,
      experience,
      education,
      certificates,
      messages,
    ] = await Promise.all([
      VisitorSession.countDocuments({ visitTime: { $gte: startOfToday } }),
      VisitorSession.countDocuments({ visitTime: { $gte: startOfWeek } }),
      VisitorSession.countDocuments({ visitTime: { $gte: startOfMonth } }),
      VisitorSession.countDocuments(),
      AnalyticsEvent.countDocuments({ eventName: "pageView" }),
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        visitorsToday,
        visitorsThisWeek,
        visitorsThisMonth,
        totalViews: totalViews || 1,
        uniqueVisitors: uniqueVisitors || 1,
        projects,
        skills,
        experience,
        education,
        certificates,
        messages,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
