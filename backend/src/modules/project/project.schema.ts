import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Project title is required",
      })
      .min(1, "Project title cannot be empty")
      .trim(),
    slug: z
      .string({
        required_error: "Project slug is required",
      })
      .min(1, "Project slug cannot be empty")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens")
      .trim(),
    description: z
      .string({
        required_error: "Description is required",
      })
      .min(5, "Short description must be at least 5 characters")
      .trim(),
    longDescription: z.string().optional(),
    techStack: z
      .array(z.string(), {
        required_error: "Tech stack is required",
      })
      .min(1, "Tech stack must contain at least one technology"),
    gitHubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    liveUrl: z.string().url("Invalid Live demo URL").optional().or(z.literal("")),
    thumbnail: z.string().optional().or(z.literal("")),
    galleryImages: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    category: z
      .string({
        required_error: "Category is required",
      })
      .min(1, "Category is required")
      .trim(),
    displayOrder: z.number().default(0),
    status: z
      .enum(["Currently Building", "Coming Soon", "Planning", "Completed"])
      .default("Completed"),
    number: z.string().optional().or(z.literal("")),
    problemStatement: z.string().optional().or(z.literal("")),
    solution: z.string().optional().or(z.literal("")),
    keyFeatures: z.array(z.string()).default([]),
    accentColor: z.string().optional().or(z.literal("")),
    mockupType: z.enum(["portfolio", "restaurant", "school"]).default("portfolio"),
  }),
});

export const updateProjectSchema = z.object({
  body: createProjectSchema.shape.body.partial(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
