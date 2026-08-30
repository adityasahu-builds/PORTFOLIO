import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Project } from "@/server/models";
import { defaultProjects } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const query: any = {};
    if (featured === "true") query.featured = true;
    if (category) query.category = category;
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).lean();

    if (!projects || projects.length === 0) {
      const filtered = featured === "true"
        ? defaultProjects.filter((p) => p.featured)
        : defaultProjects;
      return NextResponse.json({ status: "success", data: filtered });
    }

    return NextResponse.json({ status: "success", data: projects });
  } catch (err: any) {
    console.error("GET /api/v1/projects error:", err.message);
    return NextResponse.json({ status: "success", data: defaultProjects });
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

    const project = await Project.create(body);
    return NextResponse.json({ status: "success", data: project, message: "Project created" }, { status: 201 });
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
        Project.findByIdAndUpdate(item.id || item._id, { displayOrder: item.displayOrder })
      );
      await Promise.all(updates);
    }

    return NextResponse.json({ status: "success", message: "Projects reordered successfully" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
