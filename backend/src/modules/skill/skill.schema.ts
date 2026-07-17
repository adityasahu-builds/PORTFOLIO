import { z } from "zod";

export const createSkillSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Skill title is required",
      })
      .min(1, "Skill title cannot be empty")
      .trim(),
    slug: z
      .string({
        required_error: "Skill slug is required",
      })
      .min(1, "Skill slug cannot be empty")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens")
      .trim(),
    category: z
      .string({
        required_error: "Category is required",
      })
      .min(1, "Category is required")
      .trim(),
    icon: z.string().optional().or(z.literal("")),
    iconName: z.string().optional().or(z.literal("")),
    imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
    skillLevel: z
      .number({
        required_error: "Skill level is required",
      })
      .min(0, "Skill level must be at least 0")
      .max(100, "Skill level cannot exceed 100"),
    experience: z.number().optional(),
    description: z.string().optional().or(z.literal("")),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    status: z.enum(["Active", "Inactive"]).default("Active"),
    x: z.string().trim().default("50%"),
    y: z.string().trim().default("50%"),
    connections: z.array(z.string()).default([]),
  }),
});

export const updateSkillSchema = z.object({
  body: createSkillSchema.shape.body.partial(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>["body"];
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>["body"];
export type BulkUpdateStatusInput = {
  ids: string[];
  status: "Active" | "Inactive";
};
export type BulkDeleteInput = {
  ids: string[];
};
