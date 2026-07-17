import { z } from "zod";

export const experienceBodySchema = z.object({
  companyName: z
    .string({
      required_error: "Company name is required",
    })
    .min(1, "Company name cannot be empty")
    .trim(),
  role: z
    .string({
      required_error: "Role / Position is required",
    })
    .min(1, "Role cannot be empty")
    .trim(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Internship", "Freelance", "Contract"])
    .default("Full-time"),
  location: z.string().optional().or(z.literal("")),
  startDate: z
    .string({
      required_error: "Start date is required",
    })
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? new Date(val) : undefined)),
  currentlyWorking: z.boolean().default(false),
  companyLogo: z.string().optional().or(z.literal("")),
  companyWebsite: z.string().url("Invalid company website URL").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologiesUsed: z.array(z.string()).default([]),
  displayOrder: z.number().default(0),
  featured: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  iconName: z.string().trim().default("Briefcase"),
});

export const createExperienceSchema = z.object({
  body: experienceBodySchema
    .refine(
      (data) => {
        if (!data.currentlyWorking && !data.endDate) {
          return false;
        }
        return true;
      },
      {
        message: "End date is required if you are not currently working there",
        path: ["endDate"],
      }
    )
    .refine(
      (data) => {
        if (data.endDate && data.startDate > data.endDate) {
          return false;
        }
        return true;
      },
      {
        message: "Start date must be before end date",
        path: ["startDate"],
      }
    ),
});

export const updateExperienceSchema = z.object({
  body: experienceBodySchema.partial(),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>["body"];
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>["body"];
