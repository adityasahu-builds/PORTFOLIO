import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Experience } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const experience = await Experience.findById(id).lean();
    if (!experience) {
      return NextResponse.json({ status: "error", message: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(
      { status: "success", data: experience },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const experience = await Experience.findByIdAndUpdate(id, body, { new: true });
    if (!experience) {
      return NextResponse.json({ status: "error", message: "Experience not found" }, { status: 404 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", data: experience, message: "Experience updated" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return NextResponse.json({ status: "error", message: "Experience not found" }, { status: 404 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ status: "success", message: "Experience deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
