import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Media } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";
import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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

    if (process.env.CLOUDINARY_CLOUD_NAME && media.publicId && !media.publicId.startsWith("local_")) {
      await cloudinary.uploader.destroy(media.publicId).catch(() => {});
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, status: "success", message: "Media deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
