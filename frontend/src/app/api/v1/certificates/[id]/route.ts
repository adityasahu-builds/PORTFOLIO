import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Certificate } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const certificate = await Certificate.findById(id).lean();
    if (!certificate) {
      return NextResponse.json({ status: "error", message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: certificate });
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

    const certificate = await Certificate.findByIdAndUpdate(id, body, { new: true });
    if (!certificate) {
      return NextResponse.json({ status: "error", message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: certificate, message: "Certificate updated" });
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

    const certificate = await Certificate.findByIdAndDelete(id);
    if (!certificate) {
      return NextResponse.json({ status: "error", message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Certificate deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
