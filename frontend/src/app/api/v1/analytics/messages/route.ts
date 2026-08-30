import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Contact, VisitorSession } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const recent = await Contact.find().sort({ createdAt: -1 }).limit(10).lean();

    const trends: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const count = await Contact.countDocuments({ createdAt: { $gte: start, $lt: end } });
      trends.push({ date: dateStr, count });
    }

    // Active days breakdown
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const activeDays = await Promise.all(
      dayNames.map(async (day, index) => {
        const count = await VisitorSession.countDocuments({
          $expr: { $eq: [{ $dayOfWeek: "$visitTime" }, index + 1] },
        });
        return { day, visitors: count };
      })
    );

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        trends,
        recent,
        activeDays,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
