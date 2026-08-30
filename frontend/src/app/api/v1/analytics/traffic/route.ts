import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { VisitorSession } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [browsers, devices, countries, referrals] = await Promise.all([
      VisitorSession.aggregate([
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      VisitorSession.aggregate([
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
      VisitorSession.aggregate([
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      VisitorSession.aggregate([
        { $group: { _id: "$referralSource", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    // Generate trend data for the last 7 days
    const trends: { date: string; visitors: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const count = await VisitorSession.countDocuments({ visitTime: { $gte: start, $lt: end } });
      trends.push({ date: dateStr, visitors: count });
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        trends,
        browsers: browsers.length ? browsers : [{ name: "Chrome", count: 1 }],
        devices: devices.length ? devices : [{ name: "Desktop", count: 1 }],
        countries: countries.length ? countries : [{ name: "India", count: 1 }],
        referrals: referrals.length ? referrals : [{ name: "Direct", count: 1 }],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
