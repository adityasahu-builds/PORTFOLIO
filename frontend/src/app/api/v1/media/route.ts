import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Media } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";
    const mimeTypeFilter = searchParams.get("mimeTypeFilter") || "";

    const query: any = {};
    if (search) {
      query.originalName = { $regex: search, $options: "i" };
    }
    if (mimeTypeFilter) {
      query.mimeType = { $regex: mimeTypeFilter, $options: "i" };
    }

    await connectDB();
    const skip = (page - 1) * limit;

    const [total, media] = await Promise.all([
      Media.countDocuments(query),
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        media: media || [],
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
