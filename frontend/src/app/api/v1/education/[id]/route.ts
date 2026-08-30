import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Education } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const education = await Education.findById(id).lean();
    if (!education) {
      return NextResponse.json({ status: "error", message: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: education });
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

    const education = await Education.findByIdAndUpdate(id, body, { new: true });
    if (!education) {
      return NextResponse.json({ status: "error", message: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: education, message: "Education updated" });
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

    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return NextResponse.json({ status: "error", message: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Education deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
