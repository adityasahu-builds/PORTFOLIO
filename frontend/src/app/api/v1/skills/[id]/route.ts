import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Skill } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let skill = await Skill.findById(id).lean();
    if (!skill) {
      skill = await Skill.findOne({ slug: id }).lean();
    }

    if (!skill) {
      return NextResponse.json({ status: "error", message: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: skill });
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

    const skill = await Skill.findByIdAndUpdate(id, body, { new: true });
    if (!skill) {
      return NextResponse.json({ status: "error", message: "Skill not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
    } catch {}
    return NextResponse.json({ status: "success", data: skill, message: "Skill updated" });
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

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return NextResponse.json({ status: "error", message: "Skill not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
    } catch {}
    return NextResponse.json({ status: "success", message: "Skill deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
