import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Project } from "@/server/models";
import { defaultProjects } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let project = await Project.findById(id).lean();
    if (!project) {
      project = await Project.findOne({ slug: id }).lean();
    }

    if (!project) {
      const fallback = defaultProjects.find((p) => p.slug === id);
      if (fallback) {
        return NextResponse.json(
          { status: "success", data: fallback },
          { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
        );
      }
      return NextResponse.json({ status: "error", message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { status: "success", data: project },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
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
      return NextResponse.json({ status: "error", message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    // Required title validation
    if (body.title !== undefined && (!body.title || typeof body.title !== "string" || !body.title.trim())) {
      return NextResponse.json({ status: "error", message: "Project title cannot be empty." }, { status: 400 });
    }

    // Synchronize aliases
    if (body.shortDescription && !body.description) body.description = body.shortDescription;
    if (body.description && !body.shortDescription) body.shortDescription = body.description;
    if (body.technologies && (!body.techStack || body.techStack.length === 0)) body.techStack = body.technologies;
    if (body.techStack && (!body.technologies || body.technologies.length === 0)) body.technologies = body.techStack;
    if (body.githubUrl && !body.gitHubUrl) body.gitHubUrl = body.githubUrl;
    if (body.gitHubUrl && !body.githubUrl) body.githubUrl = body.gitHubUrl;
    if (body.image && !body.thumbnail) body.thumbnail = body.image;
    if (body.thumbnail && !body.image) body.image = body.thumbnail;
    if (typeof body.order === "number") body.displayOrder = body.order;
    if (typeof body.displayOrder === "number") body.order = body.displayOrder;

    const project = await Project.findByIdAndUpdate(id, body, { new: true });
    if (!project) {
      return NextResponse.json({ status: "error", message: "Project not found." }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e: any) {
      // safe fallback
    }

    return NextResponse.json({ status: "success", data: project, message: "Project updated successfully." });
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
      return NextResponse.json({ status: "error", message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ status: "error", message: "Project not found." }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e: any) {
      // safe fallback
    }

    return NextResponse.json({ status: "success", message: "Project deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
