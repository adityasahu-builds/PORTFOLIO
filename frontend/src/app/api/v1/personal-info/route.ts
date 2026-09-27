import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { PersonalInfo } from "@/server/models";
import { defaultPersonalInfo } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const info = await PersonalInfo.findOne().lean();
    return NextResponse.json(
      {
        status: "success",
        data: info || defaultPersonalInfo,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("GET /api/v1/personal-info error:", err.message);
    return NextResponse.json(
      {
        status: "success",
        data: defaultPersonalInfo,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = new PersonalInfo(body);
    } else {
      if (body.hero) info.hero = { ...((info.hero as any) || {}), ...body.hero };
      if (body.about) info.about = { ...((info.about as any) || {}), ...body.about };
      if (body.contact) info.contact = { ...((info.contact as any) || {}), ...body.contact };
      if (body.socialLinks) info.socialLinks = { ...((info.socialLinks as any) || {}), ...body.socialLinks };
      if (body.seo) info.seo = { ...((info.seo as any) || {}), ...body.seo };
    }

    await info.save();
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {
      // safe fallback
    }
    return NextResponse.json({
      status: "success",
      data: info,
      message: "Personal info updated successfully",
    });
  } catch (err: any) {
    console.error("PUT /api/v1/personal-info error:", err.message);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
