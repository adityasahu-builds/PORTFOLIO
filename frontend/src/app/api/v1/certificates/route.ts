import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Certificate } from "@/server/models";
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

    const certificates = await Certificate.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      { status: "success", data: certificates || [] },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("GET /api/v1/certificates error:", err.message);
    return NextResponse.json(
      { status: "success", data: [] },
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

    const certificate = await Certificate.create(body);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", data: certificate, message: "Certificate created" }, { status: 201 });
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
        Certificate.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
      );
      await Promise.all(updates);
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", message: "Certificates reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
