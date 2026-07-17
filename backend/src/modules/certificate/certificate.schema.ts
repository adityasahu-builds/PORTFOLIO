import { z } from "zod";

export const createCertificateSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Certificate title is required" })
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters")
      .trim(),
    issuer: z
      .string({ required_error: "Issuer is required" })
      .min(1, "Issuer cannot be empty")
      .max(150, "Issuer cannot exceed 150 characters")
      .trim(),
    issueDate: z
      .string({ required_error: "Issue date is required" })
      .min(1, "Issue date is required"),
    expiryDate: z.string().optional().or(z.literal("")),
    doesNotExpire: z.boolean().default(false),
    credentialId: z.string().optional().or(z.literal("")),
    credentialUrl: z.string().url("Invalid credential URL").optional().or(z.literal("")),
    imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
    skills: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    displayOrder: z.number().default(0),
    status: z.enum(["Active", "Inactive"]).default("Active"),
  }),
});

export const updateCertificateSchema = z.object({
  body: createCertificateSchema.shape.body.partial(),
});

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>["body"];
export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>["body"];
