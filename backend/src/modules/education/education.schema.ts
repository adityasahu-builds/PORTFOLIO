import { z } from "zod";

export const educationBodySchema = z.object({
  institutionName: z
    .string({
      required_error: "Institution name is required",
    })
    .min(1, "Institution name cannot be empty")
    .trim(),
  degree: z
    .string({
      required_error: "Degree is required",
    })
    .min(1, "Degree cannot be empty")
    .trim(),
  fieldOfStudy: z
    .string({
      required_error: "Field of study is required",
    })
    .min(1, "Field of study cannot be empty")
    .trim(),
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
  currentlyStudying: z.boolean().default(false),
  grade: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  achievements: z.array(z.string()).default([]),
  institutionLogo: z.string().optional().or(z.literal("")),
  institutionWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  displayOrder: z.number().default(0),
  featured: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const createEducationSchema = z.object({
  body: educationBodySchema
    .refine(
      (data) => {
        if (!data.currentlyStudying && !data.endDate) {
          return false;
        }
        return true;
      },
      {
        message: "End date is required if you are not currently studying there",
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

export const updateEducationSchema = z.object({
  body: educationBodySchema.partial(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>["body"];
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>["body"];
