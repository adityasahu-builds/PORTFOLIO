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

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json({ success: false, status: "error", message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let secureUrl = "";
    let publicId = `local_${Date.now()}_${file.name}`;
    let width: number | undefined;
    let height: number | undefined;

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      secureUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
      width = uploadResult.width;
      height = uploadResult.height;
    } else {
      // Fallback Data URL
      const base64 = buffer.toString("base64");
      secureUrl = `data:${file.type};base64,${base64}`;
    }

    await connectDB();
    const mediaDoc = await Media.create({
      originalName: file.name,
      publicId,
      secureUrl,
      width,
      height,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      folder,
    });

    return NextResponse.json({
      success: true,
      status: "success",
      data: mediaDoc,
      message: "File uploaded successfully",
    }, { status: 201 });
  } catch (err: any) {
    console.error("Media upload error:", err.message);
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
