import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/connection";
import { Project } from "@/server/models";
import { defaultProjects } from "@/server/db/seedData";
import { extractAuthUser } from "@/server/utils/auth";

export const dynamic = "force-dynamic";

// Safe one-time auto-migration to ensure initial projects (CV Analyzer, Ultron, AERIS) exist in database
async function ensureProjectsMigrated() {
  try {
    const cvAnalyzer = await Project.findOne({
      $or: [{ slug: "cv-analyzer" }, { title: "CV Analyzer" }],
    });

    if (!cvAnalyzer) {
      for (const item of defaultProjects) {
        const existing = await Project.findOne({
          $or: [{ slug: item.slug }, { title: item.title }],
        });
        if (!existing) {
          await Project.create(item);
        }
      }
    }

    // Ensure portfolio itself is never marked featured in database
    await Project.updateMany(
      {
        $or: [
          { slug: "portfolio-website" },
          { title: { $regex: /portfolio/i } },
        ],
        featured: true,
      },
      { featured: false }
    );
  } catch (e: any) {
    console.warn("Project migration check skipped or failed:", e.message);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await ensureProjectsMigrated();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const includePortfolio = searchParams.get("includePortfolio") === "true";

    const query: any = {};
    if (featured === "true") {
      query.featured = true;
    }
    if (category && category !== "all") {
      query.category = category;
    }
    if (status && status !== "all") {
      query.status = status;
    }

    // Strictly exclude the portfolio self-showcase from public results
    if (!includePortfolio) {
      query.slug = { $ne: "portfolio-website" };
      query.title = { $not: { $regex: /portfolio website/i } };
    }

    let projectQuery = Project.find(query).sort({ displayOrder: 1, order: 1, createdAt: -1 });

    // Homepage limit to exactly 3 featured projects
    if (featured === "true") {
      projectQuery = projectQuery.limit(3);
    }

    const projects = await projectQuery.lean();

    if (!projects || projects.length === 0) {
      const filtered = (defaultProjects as any[])
        .filter((p) => (featured === "true" ? p.featured : true))
        .filter((p) => p.slug !== "portfolio-website");
      return NextResponse.json(
        { status: "success", data: filtered.slice(0, featured === "true" ? 3 : undefined) },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    return NextResponse.json(
      { status: "success", data: projects },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("GET /api/v1/projects error:", err.message);
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const filtered = (defaultProjects as any[])
      .filter((p) => (featured === "true" ? p.featured : true))
      .filter((p) => p.slug !== "portfolio-website");
    return NextResponse.json(
      {
        status: "success",
        data: filtered.slice(0, featured === "true" ? 3 : undefined),
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Required validation
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ status: "error", message: "Project title is required." }, { status: 400 });
    }

    const description = body.description || body.shortDescription || "";
    if (!description.trim()) {
      return NextResponse.json({ status: "error", message: "Project description is required." }, { status: 400 });
    }

    // Max 3 featured projects rule
    if (body.featured === true) {
      const currentFeaturedCount = await Project.countDocuments({
        featured: true,
        slug: { $ne: "portfolio-website" },
      });

      if (currentFeaturedCount >= 3) {
        return NextResponse.json(
          {
            status: "error",
            message: "You already have 3 featured projects. Unfeature an existing project before featuring this one.",
          },
          { status: 400 }
        );
      }
    }

    // Auto-generate slug if missing
    if (!body.slug && body.title) {
      let candidateSlug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const existing = await Project.findOne({ slug: candidateSlug });
      if (existing) {
        candidateSlug = `${candidateSlug}-${Date.now().toString().slice(-4)}`;
      }
      body.slug = candidateSlug;
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

    const project = await Project.create(body);

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e: any) {
      // safe fallback if called outside request context
    }

    return NextResponse.json({ status: "success", data: project, message: "Project created successfully." }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await connectDB();
    const body = await req.json(); // Array of { id, displayOrder, order }

    if (Array.isArray(body)) {
      const updates = body.map((item) => {
        const orderVal = item.order ?? item.displayOrder;
        return Project.findByIdAndUpdate(item.id || item._id, {
          displayOrder: orderVal,
          order: orderVal,
        });
      });
      await Promise.all(updates);
    }

    try {
      revalidatePath("/");
      revalidatePath("/projects");
    } catch (e: any) {
      // safe fallback
    }

    return NextResponse.json({ status: "success", message: "Projects reordered successfully." });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
