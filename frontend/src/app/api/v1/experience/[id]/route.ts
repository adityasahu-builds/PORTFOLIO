import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Experience } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

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

    return NextResponse.json({ status: "success", data: experience });
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

    return NextResponse.json({ status: "success", message: "Experience deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
