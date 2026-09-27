import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Media } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "portfolio";

let bucketChecked = false;
async function ensureBucket() {
  if (bucketChecked) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_NAME);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
    }
    bucketChecked = true;
  } catch (err: any) {
    console.warn("Supabase Storage bucket check notice:", err?.message || err);
  }
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

    await ensureBucket();

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanName}`;

    let secureUrl = "";
    let publicId = filePath;

    // 1. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      secureUrl = publicUrlData.publicUrl;
      publicId = filePath;
    } else {
      console.warn("Supabase Storage upload warning, falling back to data URI:", uploadError?.message || uploadError);
      // Clean fallback directly into Supabase media table
      const base64 = buffer.toString("base64");
      secureUrl = `data:${file.type};base64,${base64}`;
      publicId = `supabase_db_${Date.now()}_${cleanName}`;
    }

    await connectDB();
    const mediaDoc = await Media.create({
      originalName: file.name,
      publicId,
      secureUrl,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      folder,
    });

    return NextResponse.json({
      success: true,
      status: "success",
      data: mediaDoc,
      message: "File uploaded successfully to Supabase",
    }, { status: 201 });
  } catch (err: any) {
    console.error("Media upload error:", err.message);
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
