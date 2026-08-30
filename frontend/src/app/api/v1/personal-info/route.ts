import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { PersonalInfo } from "@/server/models";
import { defaultPersonalInfo } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET() {
  try {
    await connectDB();
    const info = await PersonalInfo.findOne().lean();
    return NextResponse.json({
      status: "success",
      data: info || defaultPersonalInfo,
    });
  } catch (err: any) {
    console.error("GET /api/v1/personal-info error:", err.message);
    return NextResponse.json({
      status: "success",
      data: defaultPersonalInfo,
    });
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
      if (body.hero) info.hero = { ...info.hero, ...body.hero };
      if (body.about) info.about = { ...info.about, ...body.about };
      if (body.contact) info.contact = { ...info.contact, ...body.contact };
      if (body.socialLinks) info.socialLinks = { ...info.socialLinks, ...body.socialLinks };
      if (body.seo) info.seo = { ...info.seo, ...body.seo };
    }

    await info.save();
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
