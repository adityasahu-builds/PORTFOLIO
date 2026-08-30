import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Skill } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { orders } = await req.json();
    if (!Array.isArray(orders)) {
      return NextResponse.json({ status: "error", message: "Orders array required" }, { status: 400 });
    }

    await connectDB();
    const updates = orders.map((item: any) =>
      Skill.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
    );
    await Promise.all(updates);

    return NextResponse.json({ status: "success", message: "Skills reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
