import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { VisitorSession, AnalyticsEvent } from "@/server/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, eventName, pagePath, details } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, status: "error", message: "sessionId is required" }, { status: 400 });
    }

    await connectDB();

    // Check if session exists or create/update it
    let session = await VisitorSession.findOne({ sessionId });
    if (!session) {
      const userAgent = req.headers.get("user-agent") || "";
      const isMobile = /mobile|iphone|ipod|android/i.test(userAgent);
      const isTablet = /tablet|ipad/i.test(userAgent);

      session = new VisitorSession({
        sessionId,
        deviceType: isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop",
        landingPage: pagePath || "/",
        visitTime: new Date(),
        lastActiveTime: new Date(),
      });
      await session.save();
    } else {
      session.lastActiveTime = new Date();
      session.sessionDuration = Math.round((Date.now() - new Date(session.visitTime).getTime()) / 1000);
      await session.save();
    }

    if (eventName) {
      await AnalyticsEvent.create({
        sessionId,
        eventName,
        pagePath: pagePath || "/",
        details: details || {},
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ success: true, status: "success" });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
