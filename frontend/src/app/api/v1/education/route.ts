import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Education } from "@/server/models";
import { defaultEducations } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const query: any = {};
    if (status) query.status = status;
    if (featured === "true") query.featured = true;

    const educations = await Education.find(query)
      .sort({ displayOrder: 1, startDate: -1 })
      .lean();

    if (!educations || educations.length === 0) {
      const filtered = status
        ? defaultEducations.filter((e) => e.status === status)
        : defaultEducations;
      return NextResponse.json({ status: "success", data: filtered });
    }

    return NextResponse.json({ status: "success", data: educations });
  } catch (err: any) {
    console.error("GET /api/v1/education error:", err.message);
    return NextResponse.json({ status: "success", data: defaultEducations });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const education = await Education.create(body);
    return NextResponse.json({ status: "success", data: education, message: "Education created" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (Array.isArray(body)) {
      const updates = body.map((item) =>
        Education.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
      );
      await Promise.all(updates);
    }

    return NextResponse.json({ status: "success", message: "Education reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
