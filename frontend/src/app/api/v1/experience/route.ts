import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Experience } from "@/server/models";
import { defaultExperiences } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const query: any = {};
    if (status) query.status = status;
    if (featured === "true") query.featured = true;

    const experiences = await Experience.find(query)
      .sort({ displayOrder: 1, startDate: -1 })
      .lean();

    if (!experiences || experiences.length === 0) {
      const totalCount = await Experience.countDocuments();
      if (totalCount === 0) {
        const filtered = status
          ? defaultExperiences.filter((e) => e.status === status)
          : defaultExperiences;
        return NextResponse.json(
          { status: "success", data: filtered },
          { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
        );
      }
      return NextResponse.json(
        { status: "success", data: [] },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    return NextResponse.json(
      { status: "success", data: experiences },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("GET /api/v1/experience error:", err.message);
    return NextResponse.json(
      { status: "success", data: defaultExperiences },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
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

    const experience = await Experience.create(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", data: experience, message: "Experience created" }, { status: 201 });
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
    const body = await req.json(); // Array of { id, displayOrder }

    if (Array.isArray(body)) {
      const updates = body.map((item) =>
        Experience.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
      );
      await Promise.all(updates);
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", message: "Experiences reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
