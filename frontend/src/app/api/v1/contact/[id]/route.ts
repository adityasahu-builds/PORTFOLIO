import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Contact } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

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

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json({ status: "error", message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Message deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
