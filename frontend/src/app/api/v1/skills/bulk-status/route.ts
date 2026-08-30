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

    const { ids, status } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return NextResponse.json({ status: "error", message: "Invalid IDs or status" }, { status: 400 });
    }

    await connectDB();
    await Skill.updateMany({ _id: { $in: ids } }, { status });

    return NextResponse.json({ status: "success", message: `Updated status for ${ids.length} skills` });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
