import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Skill } from "@/server/models";
import { defaultSkills } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const skills = await Skill.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();

    if (!skills || skills.length === 0) {
      const filtered = status
        ? defaultSkills.filter((s) => s.status === status)
        : defaultSkills;
      return NextResponse.json({ status: "success", data: filtered });
    }

    return NextResponse.json({ status: "success", data: skills });
  } catch (err: any) {
    console.error("GET /api/v1/skills error:", err.message);
    return NextResponse.json({ status: "success", data: defaultSkills });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const skill = await Skill.create(body);
    return NextResponse.json({ status: "success", data: skill, message: "Skill created" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json(); // Array of { id, displayOrder }

    if (Array.isArray(body)) {
      const updates = body.map((item) =>
        Skill.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
      );
      await Promise.all(updates);
    }

    return NextResponse.json({ status: "success", message: "Skills reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
