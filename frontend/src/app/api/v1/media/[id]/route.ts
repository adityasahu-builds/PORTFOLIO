import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Media } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ success: false, status: "error", message: "Media not found" }, { status: 404 });
    }

    // Delete from Supabase Storage if it was uploaded to a bucket
    if (media.publicId && !media.publicId.startsWith("supabase_db_")) {
      await supabase.storage.from("portfolio").remove([media.publicId]).catch(() => {});
    }

    // Delete record from Supabase PostgreSQL media table
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, status: "success", message: "Media deleted successfully from Supabase" });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
