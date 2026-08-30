import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { AnalyticsEvent, Project } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [topPages, projectEvents, socialClicks, ctaClicks, resumeDownloads] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: { eventName: "pageView" } },
        { $group: { _id: "$pagePath", views: { $sum: 1 } } },
        { $project: { path: "$_id", views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventName: "projectView" } },
        { $group: { _id: "$details.slug", views: { $sum: 1 } } },
        { $project: { slug: "$_id", views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventName: "socialClick" } },
        { $group: { _id: "$details.platform", clicks: { $sum: 1 } } },
        { $project: { platform: "$_id", clicks: 1, _id: 0 } },
        { $sort: { clicks: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventName: "ctaClick" } },
        { $group: { _id: "$details.label", clicks: { $sum: 1 } } },
        { $project: { label: "$_id", clicks: 1, _id: 0 } },
        { $sort: { clicks: -1 } },
      ]),
      AnalyticsEvent.countDocuments({ eventName: "resumeDownload" }),
    ]);

    const projectViews = await Promise.all(
      projectEvents.map(async (p: any) => {
        const proj = await Project.findOne({ slug: p.slug }).select("title").lean();
        return {
          slug: p.slug || "unknown",
          title: proj?.title || p.slug || "Project",
          views: p.views,
        };
      })
    );

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        topPages: topPages.length ? topPages : [{ path: "/", views: 1 }],
        projectViews,
        socialClicks,
        ctaClicks,
        resumeDownloads,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
